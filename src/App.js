import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const App = () => {
  const [activeCategory, setActiveCategory] = useState('ALL') // Set to 'ALL' initially
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  const projectsApiUrl = 'https://apis.ccbp.in/ps/projects'

  const fetchProjects = async category => {
    setIsLoading(true)
    setError(false)
    try {
      const response = await fetch(`${projectsApiUrl}?category=${category}`)
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects(activeCategory)
  }, [activeCategory])

  const onChangeCategory = event => {
    setActiveCategory(event.target.value) // Update to uppercase id value
  }

  return (
    <div className="app">
      <nav className="header">
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
          alt="website logo"
          className="logo"
        />
      </nav>
      <div className="content">
        <select
          value={activeCategory}
          onChange={onChangeCategory}
          className="category-select"
        >
          {categoriesList.map(category => (
            <option key={category.id} value={category.id}>
              {category.displayText}
            </option>
          ))}
        </select>
      </div>
      {isLoading ? (
        <div data-testid="loader">
          <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
        </div>
      ) : error ? (
        <div className="error-view">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
            alt="failure view"
            className="error-image"
          />
          <h1 className="error-msg-heading">Oops! Something Went Wrong</h1>
          <p className="error-msg">
            We cannot seem to find the page you are looking for
          </p>
          <button
            onClick={() => fetchProjects(activeCategory)}
            className="error-msg-btn"
          >
            Retry
          </button>
        </div>
      ) : (
        <ul className="projects-list">
          {projects.map(project => (
            <li key={project.id} className="project-item">
              <img
                src={project.image_url}
                alt={project.name}
                className="project-image"
              />
              <p className="project-name">{project.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
