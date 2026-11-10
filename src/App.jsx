import { useState } from 'react' 
import './App.css'
import opportunities from './data/opportunities'

function App() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('All locations')
  const [format, setFormat] = useState('Any format')
  const [type, setType] = useState('All')

  const [saved, setSaved] = useState([])
  const [completed, setCompleted] = useState([])

  const [selectedOpportunity, setSelectedOpportunity] = useState(null)
  const [showPriority, setShowPriority] = useState(false)
  const [searchInterpretation, setSearchInterpretation] = useState('')

  const [communityTarget, setCommunityTarget] = useState(10)
  const [editingTarget, setEditingTarget] = useState(false)
  const [targetInput, setTargetInput] = useState('10')

  const filteredOpportunities = opportunities.filter((item) => {
    const searchText = `
      ${item.title}
      ${item.type}
      ${item.category}
      ${item.location}
      ${item.format}
      ${item.dateLabel}
      ${item.duration}
      ${item.description}
      ${item.source}
    `.toLowerCase()

    const matchesSearch =
      query.trim() === '' ||
      searchText.includes(query.toLowerCase().trim())

    const matchesLocation =
      location === 'All locations' ||
      item.location === location

    const matchesFormat =
      format === 'Any format' ||
      item.format === format

    const matchesType =
      type === 'All' ||
      item.type === type

    return (
      matchesSearch &&
      matchesLocation &&
      matchesFormat &&
      matchesType
    )
  })

  function handleQuickAction(action) {
    setQuery('')
    setLocation('All locations')
    setFormat('Any format')
    setType('All')

    if (action === 'near') {
      setLocation('Bristol')
    }

    if (action === 'volunteering') {
      setType('Volunteering')
    }

    if (action === 'month') {
      setQuery('This month')
    }

    if (action === 'virtual') {
      setFormat('Virtual')
    }

    if (action === 'person') {
      setFormat('In person')
    }

    if (action === 'sustainability') {
      setType('Sustainability')
    }
  }

  function resetFilters() {
    setQuery('')
    setLocation('All locations')
    setFormat('Any format')
    setType('All')
  }

function handleSmartSearch() {
  const text = query.toLowerCase()

  let understoodLocation = 'All locations'
  let understoodFormat = 'Any format'
  let understoodType = 'All'

  // LOCATION

  if (text.includes('bristol')) {
    understoodLocation = 'Bristol'
  }

  if (text.includes('bath')) {
    understoodLocation = 'Bath'
  }

  if (text.includes('cheltenham')) {
    understoodLocation = 'Cheltenham'
  }

  // FORMAT

  if (
    text.includes('virtual') ||
    text.includes('online') ||
    text.includes('remote')
  ) {
    understoodFormat = 'Virtual'
  }

  if (
    text.includes('in person') ||
    text.includes('in-person') ||
    text.includes('face to face')
  ) {
    understoodFormat = 'In person'
  }

  // OPPORTUNITY TYPE

  if (
    text.includes('volunteer') ||
    text.includes('volunteering')
  ) {
    understoodType = 'Volunteering'
  }

  if (
    text.includes('sustainability') ||
    text.includes('environment') ||
    text.includes('environmental') ||
    text.includes('green')
  ) {
    understoodType = 'Sustainability'
  }

  if (
    text.includes('charity') ||
    text.includes('fundraising') ||
    text.includes('fundraise')
  ) {
    understoodType = 'Charity'
  }

  if (
    text.includes('outreach') ||
    text.includes('student') ||
    text.includes('university') ||
    text.includes('mentoring')
  ) {
    understoodType = 'Outreach'
  }

const understood = []

if (understoodLocation !== 'All locations') {
  understood.push(`📍 ${understoodLocation}`)
}

if (understoodFormat !== 'Any format') {
  understood.push(`💻 ${understoodFormat}`)
}

if (understoodType !== 'All') {
  understood.push(`✨ ${understoodType}`)
}

if (understood.length > 0) {
  setSearchInterpretation(understood.join(' · '))
} else {
  setSearchInterpretation(
    'Try including a location, opportunity type or format.'
  )
}

  setLocation(understoodLocation)
  setFormat(understoodFormat)
  setType(understoodType)

  // Clear the text query after extracting the intent.
  // Otherwise our normal keyword filtering can clash with
  // the filters Community Compass has just identified.
  setQuery('')
}

  function toggleSaved(id) {
    setSaved((current) => {
      if (current.includes(id)) {
        return current.filter((savedId) => savedId !== id)
      }

      return [...current, id]
    })
  }

  function toggleCompleted(id) {
    setCompleted((current) => {
      if (current.includes(id)) {
        return current.filter(
          (completedId) => completedId !== id
        )
      }

      return [...current, id]
    })

    if (!saved.includes(id)) {
      setSaved((current) => [...current, id])
    }
  }

  function getHours(item) {
    const value = parseFloat(item.duration)

    if (Number.isNaN(value)) {
      return 0
    }

    return value
  }

  const completedOpportunities = opportunities.filter(
    (item) => completed.includes(item.id)
  )

  const savedOpportunities = opportunities.filter(
    (item) => saved.includes(item.id)
  )

  const totalHours = completedOpportunities.reduce(
    (total, item) => total + getHours(item),
    0
  )

  const progress = Math.min(
    Math.round((totalHours / communityTarget) * 100),
    100
  )

  function getCategoryHours(category) {
    return completedOpportunities
      .filter((item) => item.type === category)
      .reduce(
        (total, item) => total + getHours(item),
        0
      )
  }

function saveCommunityTarget() {
  const newTarget = Number(targetInput)

  if (
    Number.isNaN(newTarget) ||
    newTarget < 1 ||
    newTarget > 500
  ) {
    alert('Please enter a target between 1 and 500 hours.')
    return
  }

  setCommunityTarget(newTarget)
  setEditingTarget(false)
}

  function getMatchReason(item) {
    if (item.location === 'Bristol') {
      return 'This opportunity is based in Bristol and supports your selected community interests.'
    }

    if (item.format === 'Virtual') {
      return 'This opportunity can be joined virtually, offering flexibility around other work commitments.'
    }

    if (item.type === 'Sustainability') {
      return 'This opportunity directly supports sustainability and environmental community impact.'
    }

    if (item.type === 'Volunteering') {
      return 'This gives you a practical way to contribute towards your community priority.'
    }

    return 'This opportunity matches your selected location, format or community interests.'
  }

  return (
    <div className="app">

      <header className="navbar">

        <div className="brand">
          <div className="logo">&gt;</div>
          <span>Community Compass</span>
        </div>

        <button
          type="button"
          className="priority-header-button"
          onClick={() => setShowPriority(true)}
        >
          <span>📍 Bristol</span>

          <span className="priority-header-divider">
            ·
          </span>

          <strong>My Community Priority</strong>

          <span className="priority-header-count">
            {saved.length}
          </span>
        </button>

      </header>


      <main>

        <section className="hero">

          <p className="eyebrow">
            DISCOVER · CONNECT · CONTRIBUTE
          </p>

          <h1>
            Find opportunities that create
            <span> real community impact.</span>
          </h1>

          <p className="description">
            Search volunteering, charity, outreach, sustainability
            and community opportunities that match your interests,
            location and availability.
          </p>

          <div className="search">

            <input
              type="text"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Try: volunteering in Bristol, sustainability, student mentoring..."
            />

            <button
              type="button"
              onClick={handleSmartSearch}
            >
             ✨ Find opportunities
            </button>

          </div>


          <div className="quick-actions">

          {searchInterpretation && (
            <div className="ai-interpretation">
              <span className="ai-icon">✨</span>

              <div>
                <strong>
                  Community Compass understood your request
                </strong>

                <p>
                  {searchInterpretation}
                </p>
              </div>
            </div>
          )}

            <button
              type="button"
              onClick={() => handleQuickAction('near')}
            >
              📍 Events near me
            </button>

            <button
              type="button"
              onClick={() => handleQuickAction('volunteering')}
            >
              🤝 Volunteering
            </button>

            <button
              type="button"
              onClick={() => handleQuickAction('month')}
            >
              📅 This month
            </button>

            <button
              type="button"
              onClick={() => handleQuickAction('virtual')}
            >
              💻 Virtual
            </button>

            <button
              type="button"
              onClick={() => handleQuickAction('person')}
            >
              🏢 In person
            </button>

            <button
              type="button"
              onClick={() => handleQuickAction('sustainability')}
            >
              🌱 Sustainability
            </button>

          </div>

        </section>


        <section className="content">

          <aside className="filters">

            <h3>Refine results</h3>

            <label htmlFor="location-filter">
              Location
            </label>

            <select
              id="location-filter"
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
            >
              <option>All locations</option>
              <option>Bristol</option>
              <option>Bath</option>
              <option>Cheltenham</option>
              <option>Virtual</option>
            </select>


            <label htmlFor="format-filter">
              Format
            </label>

            <select
              id="format-filter"
              value={format}
              onChange={(event) =>
                setFormat(event.target.value)
              }
            >
              <option>Any format</option>
              <option>In person</option>
              <option>Virtual</option>
              <option>Hybrid</option>
            </select>


            <label htmlFor="type-filter">
              Opportunity type
            </label>

            <select
              id="type-filter"
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
            >
              <option>All</option>
              <option>Volunteering</option>
              <option>Charity</option>
              <option>Sustainability</option>
              <option>Outreach</option>
            </select>


            <button
              type="button"
              className="reset-button"
              onClick={resetFilters}
            >
              Reset filters
            </button>

          </aside>


          <section className="results">

            <div className="results-header">

              <div>
                <h2>Recommended for you</h2>

                <p>
                  {filteredOpportunities.length}{' '}
                  {filteredOpportunities.length === 1
                    ? 'opportunity'
                    : 'opportunities'}{' '}
                  found
                </p>
              </div>

              <div className="trusted">
                ✓ Trusted sources
              </div>

            </div>


            <div className="event-list">

              {filteredOpportunities.length === 0 && (

                <div className="no-results">

                  <h3>No exact matches found</h3>

                  <p>
                    Try changing your location,
                    opportunity type or format.
                  </p>

                  <button
                    type="button"
                    className="secondary"
                    onClick={resetFilters}
                  >
                    Show all opportunities
                  </button>

                </div>

              )}


              {filteredOpportunities.map((item) => {
                const isSaved = saved.includes(item.id)
                const isCompleted =
                  completed.includes(item.id)

                return (

                  <article
                    className="event-card"
                    key={item.id}
                  >

                    <div className="tags">

                      <span>
                        {item.type.toUpperCase()}
                      </span>

                      <span>
                        {item.format.toUpperCase()}
                      </span>

                      {isCompleted && (
                        <span className="completed-tag">
                          COMPLETED
                        </span>
                      )}

                    </div>

                    <h2>{item.title}</h2>

                    <p className="event-info">
                      📍 {item.location}
                      {' · '}
                      📅 {item.dateLabel}
                      {' · '}
                      ⏱ {item.duration}
                    </p>

                    <p>{item.description}</p>

                    <div className="match">

                      <strong>
                        ✨ Why this matches you
                      </strong>

                      <p>
                        {getMatchReason(item)}
                      </p>

                    </div>

                    <p className="source">
                      Source: {item.source}
                    </p>

                    <div className="card-actions">

                      <button
                        type="button"
                        className={
                          isSaved
                            ? 'saved-button'
                            : 'secondary'
                        }
                        onClick={() =>
                          toggleSaved(item.id)
                        }
                      >
                        {isSaved
                          ? '♥ Saved'
                          : '♡ Save'}
                      </button>

                      <button
                        type="button"
                        className="primary"
                        onClick={() =>
                          setSelectedOpportunity(item)
                        }
                      >
                        View opportunity
                      </button>

                    </div>

                  </article>

                )
              })}

            </div>

          </section>

        </section>

      </main>


      {/* OPPORTUNITY DETAILS */}

      {selectedOpportunity && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedOpportunity(null)
          }
        >

          <div
            className="opportunity-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="modal-close"
              onClick={() =>
                setSelectedOpportunity(null)
              }
            >
              ×
            </button>

            <p className="modal-eyebrow">
              COMMUNITY OPPORTUNITY
            </p>

            <h2>
              {selectedOpportunity.title}
            </h2>

            <div className="tags">

              <span>
                {selectedOpportunity.type.toUpperCase()}
              </span>

              <span>
                {selectedOpportunity.format.toUpperCase()}
              </span>

            </div>


            <div className="detail-grid">

              <div className="detail-box">
                <span>📍 Location</span>
                <strong>
                  {selectedOpportunity.location}
                </strong>
              </div>

              <div className="detail-box">
                <span>📅 When</span>
                <strong>
                  {selectedOpportunity.dateLabel}
                </strong>
              </div>

              <div className="detail-box">
                <span>⏱ Commitment</span>
                <strong>
                  {selectedOpportunity.duration}
                </strong>
              </div>

              <div className="detail-box">
                <span>🤝 Type</span>
                <strong>
                  {selectedOpportunity.type}
                </strong>
              </div>

            </div>


            <div className="modal-section">

              <h3>About this opportunity</h3>

              <p>
                {selectedOpportunity.description}
              </p>

            </div>


            <div className="match">

              <strong>
                ✨ Why Community Compass recommends this
              </strong>

              <p>
                {getMatchReason(
                  selectedOpportunity
                )}
              </p>

            </div>


            <div className="source-box">
              <span>Source</span>

              <strong>
                {selectedOpportunity.source}
              </strong>

              <small>
                Check the original source for the
                latest registration information.
              </small>
            </div>


            <div className="modal-actions">

              <button
                type="button"
                className={
                  saved.includes(
                    selectedOpportunity.id
                  )
                    ? 'saved-button'
                    : 'secondary'
                }
                onClick={() =>
                  toggleSaved(
                    selectedOpportunity.id
                  )
                }
              >
                {saved.includes(
                  selectedOpportunity.id
                )
                  ? '♥ Saved'
                  : '♡ Save opportunity'}
              </button>


              <button
                type="button"
                className={
                  completed.includes(
                    selectedOpportunity.id
                  )
                    ? 'completed-button'
                    : 'secondary'
                }
                onClick={() =>
                  toggleCompleted(
                    selectedOpportunity.id
                  )
                }
              >
                {completed.includes(
                  selectedOpportunity.id
                )
                  ? '✓ Completed'
                  : '✓ Mark as completed'}
              </button>


              <button
                type="button"
                className="secondary"
                onClick={() =>
                  alert(
                    'Calendar integration will be added later.'
                  )
                }
              >
                📅 Add to calendar
              </button>


              <button
                type="button"
                className="primary"
                onClick={() =>
                  alert(
                    'The production version will open the original internal source.'
                  )
                }
              >
                View original source
              </button>

            </div>

          </div>

        </div>

      )}


      {/* COMMUNITY PRIORITY DASHBOARD */}

      {showPriority && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowPriority(false)
          }
        >

          <div
            className="priority-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="modal-close"
              onClick={() =>
                setShowPriority(false)
              }
            >
              ×
            </button>


            <p className="modal-eyebrow">
              MY COMMUNITY PRIORITY
            </p>

            <h2>
              Your Community Impact
            </h2>

            <p className="priority-intro">
              Discover opportunities, take part
              and keep track of your contribution
              in one place.
            </p>


            <div className="impact-stats">

              <div className="impact-card">
                <strong>
                  {totalHours}
                </strong>
                <span>Hours contributed</span>
              </div>

              <div className="impact-card">
                <strong>
                  {completed.length}
                </strong>
                <span>Activities completed</span>
              </div>

              <div className="impact-card">
                <strong>
                  {saved.length}
                </strong>
                <span>Opportunities saved</span>
              </div>

            </div>


              <div className="priority-progress">

                <div className="progress-heading">

                  <div>
                    <strong>
                      My Community Priority
                    </strong>

                    <small>
                      {totalHours} of {communityTarget} hours completed
                    </small>
                  </div>

                  <strong className="progress-percent">
                    {progress}%
                  </strong>

                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${progress}%`
                    }}
                  />
                </div>

                {!editingTarget ? (

                  <div className="target-summary">

                    <span>
                      🎯 Your target is <strong>{communityTarget} hours</strong>
                    </span>

                    <button
                      type="button"
                      className="edit-target-button"
                      onClick={() => {
                        setTargetInput(String(communityTarget))
                        setEditingTarget(true)
                      }}
                    >
                      Edit target
                    </button>

                  </div>

                ) : (

                  <div className="target-editor">

                    <label htmlFor="target-hours">
                      Set your community priority target
                    </label>

                    <div className="target-input-row">

                      <input
                        id="target-hours"
                        type="number"
                        min="1"
                        max="500"
                        value={targetInput}
                        onChange={(event) =>
                          setTargetInput(event.target.value)
                        }
                      />

                      <span>hours</span>

                      <button
                        type="button"
                        className="save-target-button"
                        onClick={saveCommunityTarget}
                      >
                        Save target
                      </button>

                      <button
                        type="button"
                        className="cancel-target-button"
                        onClick={() => {
                          setTargetInput(String(communityTarget))
                          setEditingTarget(false)
                        }}
                      >
                        Cancel
                      </button>

                    </div>

                  </div>

                )}


            </div>


            <div className="impact-breakdown">

              <h3>
                Your impact
              </h3>

              <div className="impact-row">
                <span>
                  🤝 Volunteering
                </span>

                <strong>
                  {getCategoryHours('Volunteering')} hrs
                </strong>
              </div>

              <div className="impact-row">
                <span>
                  🎓 Outreach
                </span>

                <strong>
                  {getCategoryHours('Outreach')} hrs
                </strong>
              </div>

              <div className="impact-row">
                <span>
                  🌱 Sustainability
                </span>

                <strong>
                  {getCategoryHours('Sustainability')} hrs
                </strong>
              </div>

              <div className="impact-row">
                <span>
                  ❤️ Charity
                </span>

                <strong>
                  {getCategoryHours('Charity')} hrs
                </strong>
              </div>

            </div>


            <div className="priority-section">

              <h3>
                Saved opportunities
              </h3>

              {savedOpportunities.length === 0 ? (

                <div className="priority-empty">
                  Save an opportunity and it will
                  appear here.
                </div>

              ) : (

                savedOpportunities.map((item) => (

                  <div
                    className="saved-opportunity-row"
                    key={item.id}
                  >

                    <div>

                      <strong>
                        {item.title}
                      </strong>

                      <span>
                        {item.location}
                        {' · '}
                        {item.duration}
                      </span>

                    </div>


                    <button
                      type="button"
                      className={
                        completed.includes(item.id)
                          ? 'completed-mini-button'
                          : 'complete-mini-button'
                      }
                      onClick={() =>
                        toggleCompleted(item.id)
                      }
                    >
                      {completed.includes(item.id)
                        ? '✓ Completed'
                        : 'Mark completed'}
                    </button>

                  </div>

                ))

              )}

            </div>


            <div className="demo-note">

              <strong>
                💡 Prototype note
              </strong>

              <p>
                Community Priority targets are personalised in this prototype.
                Users can define their own target and Community Compass will
                automatically track progress as activities are completed.
              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default App