import { Star } from 'lucide-react'

const reviews = [
  {
    author: 'Giasa R',
    note: 'In-store number plate order',
    text: 'Really nice shop. Kash and the team were polite, helpful, and made the plate process easy from start to finish.',
  },
  {
    author: "Alex O'Connor",
    note: 'Style advice and fast delivery',
    text: 'Fast delivery and loads of style options. The team helped me choose the right finish and the plates arrived looking spot on.',
  },
  {
    author: 'Jon J',
    note: 'Japanese-style plates',
    text: 'Kash sorted two Jap-style plates in around half an hour. Clean finish, quick service, and exactly what I asked for.',
  },
]

export default function ReviewsSection() {
  return (
    <section className="reviews-section" aria-labelledby="reviews-heading">
      <div className="section-shell">
        <div className="section-heading">
          <p>Customer notes</p>
          <h2 id="reviews-heading">Real service, proper finish</h2>
        </div>

        <div className="reviews-grid">
          {reviews.map((review) => (
            <article key={review.author} className="review-card">
              <div className="review-card__stars" aria-label="5 star review">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={16} fill="currentColor" aria-hidden="true" />
                ))}
              </div>
              <h3>{review.author}</h3>
              <p className="review-card__note">{review.note}</p>
              <p>{review.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
