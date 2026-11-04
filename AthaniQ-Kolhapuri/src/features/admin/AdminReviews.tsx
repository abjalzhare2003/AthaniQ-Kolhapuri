import { useState } from 'react'
import {
  Star,
  Search,
  CheckCircle,
  EyeOff,
  Flag,
  Trash2,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react'
import {
  getReviews,
  updateReviewStatus,
  deleteReview,
  getProducts,
} from '@/services/dataStore'
import { AdminPageHeader } from '@/components/layout/AdminPageHeader'
import { Button, Select } from '@/components/ui/Input'
import { Dialog } from '@/components/ui/Dialog'
import { formatDateTime, formatDate } from '@/utils/format'
import { toast } from '@/stores/toastStore'
import { cn } from '@/utils/cn'
import type { Review, ReviewStatus } from '@/types'

export function AdminReviews() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'all'>('all')
  const [ratingFilter, setRatingFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all')
  const [productFilter, setProductFilter] = useState('all')

  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null)
  const [, forceRender] = useState(0)

  const products = getProducts()
  const reviews = getReviews()

  // Counters
  const totalCount = reviews.length
  const pendingCount = reviews.filter((r) => r.status === 'pending').length
  const approvedCount = reviews.filter((r) => r.status === 'approved').length
  const flaggedCount = reviews.filter((r) => r.status === 'flagged').length
  const avgRating =
    approvedCount > 0
      ? (
          reviews
            .filter((r) => r.status === 'approved')
            .reduce((s, r) => s + r.rating, 0) / approvedCount
        ).toFixed(1)
      : '0.0'

  const filteredReviews = reviews.filter((r) => {
    // Status
    if (statusFilter !== 'all' && r.status !== statusFilter) return false

    // Rating
    if (ratingFilter !== 'all' && r.rating !== Number(ratingFilter)) return false

    // Product
    if (productFilter !== 'all' && r.productId !== productFilter) return false

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      const matchCustomer = r.customerName.toLowerCase().includes(q)
      const matchProduct = r.productName.toLowerCase().includes(q)
      const matchComment = r.comment.toLowerCase().includes(q)
      const matchTitle = r.title?.toLowerCase().includes(q)
      if (!matchCustomer && !matchProduct && !matchComment && !matchTitle) return false
    }

    return true
  })

  const handleUpdateStatus = (id: string, newStatus: ReviewStatus, note?: string) => {
    updateReviewStatus(id, newStatus, note)
    toast(
      newStatus === 'approved' ? 'success' : newStatus === 'hidden' ? 'info' : 'warning',
      `Review status updated to "${newStatus}"`,
    )
    if (selectedReview?.id === id) {
      setSelectedReview((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
    forceRender((n) => n + 1)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteReview(deleteTarget.id)
    toast('success', 'Review deleted successfully.')
    setDeleteTarget(null)
    forceRender((n) => n + 1)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Customer Reviews Moderation"
        description="Moderate, approve, flag, or hide customer reviews across the AthaniQ footwear catalogue"
      />

      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              Total Reviews
            </span>
            <MessageSquare className="h-4 w-4 text-brand" />
          </div>
          <div className="mt-2 text-2xl font-bold text-charcoal">{totalCount}</div>
          <div className="text-xs text-muted mt-0.5">Across all footwear lines</div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              Pending Moderation
            </span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-700">{pendingCount}</div>
          <div className="text-xs text-muted mt-0.5">
            {flaggedCount > 0 ? `${flaggedCount} flagged for review` : 'Awaiting admin review'}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              Approved / Live
            </span>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-green-700">{approvedCount}</div>
          <div className="text-xs text-muted mt-0.5">Visible to storefront shoppers</div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              Average Rating
            </span>
            <Star className="h-4 w-4 text-accent fill-accent" />
          </div>
          <div className="mt-2 text-2xl font-bold text-charcoal flex items-center gap-1.5">
            {avgRating} <span className="text-xs font-normal text-muted">/ 5.0</span>
          </div>
          <div className="text-xs text-muted mt-0.5">Approved reviews average</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer, keyword, product…"
              className="input-base pl-9 text-sm"
            />
          </div>

          <Select
            name="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All Moderation Statuses</option>
            <option value="pending">Pending Moderation</option>
            <option value="approved">Approved & Published</option>
            <option value="flagged">Flagged for Follow-up</option>
            <option value="hidden">Hidden / Spam</option>
          </Select>

          <Select
            name="rating"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value as any)}
          >
            <option value="all">All Star Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </Select>

          <Select
            name="product"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
          >
            <option value="all">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-center justify-between text-xs text-muted pt-1 border-t border-muted-border">
          <span>
            Showing <strong>{filteredReviews.length}</strong> of <strong>{reviews.length}</strong> reviews
          </span>
          {(search || statusFilter !== 'all' || ratingFilter !== 'all' || productFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('')
                setStatusFilter('all')
                setRatingFilter('all')
                setProductFilter('all')
              }}
              className="text-brand hover:underline font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Reviews Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted-bg border-b border-muted-border text-xs font-semibold text-muted uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Customer</th>
                <th className="px-4 py-3.5">Product</th>
                <th className="px-4 py-3.5">Rating & Review</th>
                <th className="px-4 py-3.5">Submitted</th>
                <th className="px-4 py-3.5">Moderation</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted-border">
              {filteredReviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-muted-bg/40 transition-colors">
                  {/* Customer */}
                  <td className="px-4 py-3">
                    <div className="font-semibold text-charcoal">{rev.customerName}</div>
                    {rev.verifiedPurchase && (
                      <span className="text-3xs text-green-700 font-bold inline-flex items-center gap-0.5 mt-0.5">
                        <ShieldCheck className="h-3 w-3" /> Verified Buyer
                      </span>
                    )}
                    {rev.customerEmail && (
                      <div className="text-3xs text-muted truncate max-w-[120px]">{rev.customerEmail}</div>
                    )}
                  </td>

                  {/* Product */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 max-w-[180px]">
                      <img
                        src={rev.productImage}
                        alt=""
                        className="h-9 w-9 rounded-md object-cover bg-ivory-100 border border-muted-border flex-shrink-0"
                      />
                      <span className="font-medium text-xs text-charcoal truncate">{rev.productName}</span>
                    </div>
                  </td>

                  {/* Rating & Excerpt */}
                  <td className="px-4 py-3 max-w-sm">
                    <div className="flex items-center gap-1 text-accent mb-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={cn('h-3.5 w-3.5', s <= rev.rating ? 'fill-accent' : 'text-muted-border')}
                        />
                      ))}
                      <span className="text-xs font-bold text-charcoal ml-1">{rev.rating}.0</span>
                    </div>
                    {rev.title && <div className="font-semibold text-xs text-charcoal truncate">{rev.title}</div>}
                    <p className="text-xs text-charcoal-100 line-clamp-2 mt-0.5">{rev.comment}</p>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                    {formatDate(rev.createdAt)}
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'text-3xs font-bold uppercase px-2 py-0.5 rounded-full inline-flex items-center gap-1',
                        rev.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : rev.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : rev.status === 'flagged'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-700',
                      )}
                    >
                      {rev.status === 'approved' && <CheckCircle className="h-3 w-3" />}
                      {rev.status === 'pending' && <AlertTriangle className="h-3 w-3" />}
                      {rev.status === 'flagged' && <Flag className="h-3 w-3" />}
                      {rev.status === 'hidden' && <EyeOff className="h-3 w-3" />}
                      {rev.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedReview(rev)}
                        className="text-xs py-1 px-2"
                      >
                        Inspect
                      </Button>
                      {rev.status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateStatus(rev.id, 'approved')}
                          className="p-1 rounded text-green-700 hover:bg-green-50 transition"
                          title="Approve / Publish Review"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {rev.status !== 'hidden' && (
                        <button
                          onClick={() => handleUpdateStatus(rev.id, 'hidden')}
                          className="p-1 rounded text-muted hover:text-charcoal hover:bg-muted-bg transition"
                          title="Hide Review"
                        >
                          <EyeOff className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteTarget(rev)}
                        className="p-1 rounded text-muted hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete Review"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredReviews.length === 0 && (
            <div className="p-12 text-center text-muted">No customer reviews match the selected filters.</div>
          )}
        </div>
      </div>

      {/* Inspect Review Dialog */}
      <Dialog
        open={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        title="Customer Review Details"
        size="md"
      >
        {selectedReview && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-ivory-100 border border-muted-border">
              <img
                src={selectedReview.productImage}
                alt=""
                className="h-12 w-12 rounded-lg object-cover bg-white"
              />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm text-charcoal">{selectedReview.productName}</div>
                <div className="text-xs text-muted">Submitted on {formatDateTime(selectedReview.createdAt)}</div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-accent">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        'h-4 w-4',
                        s <= selectedReview.rating ? 'fill-accent' : 'text-muted-border',
                      )}
                    />
                  ))}
                  <span className="text-sm font-bold text-charcoal ml-1">{selectedReview.rating} out of 5</span>
                </div>
                <span className="text-xs text-muted">By <strong>{selectedReview.customerName}</strong></span>
              </div>
              {selectedReview.title && (
                <h4 className="font-semibold text-base text-brand-700 pt-2">{selectedReview.title}</h4>
              )}
              <p className="text-sm text-charcoal-100 leading-relaxed pt-1">{selectedReview.comment}</p>
            </div>

            {selectedReview.moderationNote && (
              <div className="p-3 rounded-lg bg-purple-50 text-purple-800 text-xs border border-purple-200">
                <strong>Moderation Note:</strong> {selectedReview.moderationNote}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-muted-border pt-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedReview.id, 'flagged', 'Flagged for support check')}
                >
                  <Flag className="h-3.5 w-3.5 text-purple-600 mr-1" /> Flag
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedReview.id, 'hidden', 'Hidden by admin')}
                >
                  <EyeOff className="h-3.5 w-3.5 text-muted mr-1" /> Hide
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setSelectedReview(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleUpdateStatus(selectedReview.id, 'approved')
                    setSelectedReview(null)
                  }}
                >
                  Approve & Publish
                </Button>
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* Delete Review Dialog */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Review Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-charcoal-100">
            Are you sure you want to permanently delete the review submitted by{' '}
            <strong>"{deleteTarget?.customerName}"</strong>?
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Review
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
