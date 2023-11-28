import {Component} from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

class Home extends Component {
  state = {
    activeCategory: categoriesList[0].id,
    apiCallStatus: apiStatusConstants.initial,
    listItems: [],
  }

  componentDidMount() {
    this.getApiCall()
  }

  getApiCall = async () => {
    this.setState({apiCallStatus: apiStatusConstants.inProgress})
    const {activeCategory} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeCategory}`
    const response = await fetch(url)
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = data.projects.map(eachItem => ({
        ...eachItem,
        imageUrl: eachItem.image_url,
      }))
      this.setState({
        listItems: formattedData,
        apiCallStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiCallStatus: apiStatusConstants.failure})
    }
  }

  renderCases = () => {
    const {apiCallStatus} = this.state
    switch (apiCallStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  onRetry = () => {
    this.getApiCall()
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-failure">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="loader-failure">
      <img
        className="failure-img"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1 className="oops-txt">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-btn" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {listItems} = this.state
    return (
      <ul className="list-cont">
        {listItems.map(eachItem => (
          <li key={eachItem.id} className="list-item">
            <img
              className="card-img"
              src={eachItem.imageUrl}
              alt={eachItem.name}
            />
            <p className="card-txt">{eachItem.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  onSelectCategory = event => {
    this.setState({activeCategory: event.target.value}, this.getApiCall)
  }

  render() {
    const {activeCategory} = this.state
    return (
      <div className="main-cont">
        <nav className="header-cont">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>
        <div className="bg-cont">
          <select
            name="categories"
            onChange={this.onSelectCategory}
            value={activeCategory}
            className="input"
          >
            {categoriesList.map(eachCategory => (
              <option key={eachCategory.id} value={eachCategory.id}>
                {eachCategory.displayText}
              </option>
            ))}
          </select>
          {this.renderCases()}
        </div>
      </div>
    )
  }
}

export default Home
