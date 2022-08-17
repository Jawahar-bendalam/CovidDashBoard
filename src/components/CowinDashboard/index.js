// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationCoverage from '../VaccinationCoverage'
import './index.css'

const apistatusconstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class CowinDashboard extends Component {
  state = {apiStatus: apistatusconstants.initial, vaccinationData: {}}

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({apiStatus: apistatusconstants.loading})

    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(apiUrl)

    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = {
        last7daysData: fetchedData.last_7_days_vaccination.map(eachDayData => ({
          vaccineDate: eachDayData.vaccine_date,
          dose1: eachDayData.dose_1,
          dose2: eachDayData.dose_2,
        })),
        vaccinationByAge: fetchedData.vaccination_by_age.map(eachAge => ({
          age: eachAge.age,
          count: eachAge.count,
        })),
        vaccinationByGender: fetchedData.vaccination_by_gender.map(
          eachgender => ({
            count: eachgender.count,
            gender: eachgender.gender,
          }),
        ),
      }
      this.setState({
        apiStatus: apistatusconstants.success,
        vaccinationData: updatedData,
      })
    } else {
      this.setState({apiStatus: apistatusconstants.failure})
    }
  }

  renderViewBasedOnAPIStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apistatusconstants.success:
        return this.renderVaccinationStats()
      case apistatusconstants.failure:
        return this.renderFailureView()
      case apistatusconstants.loading:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderLoadingView = () => (
    <div className="loading-view" testid="loader">
      <Loader color="#ffffff" height={80} type="ThreeDots" width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  renderVaccinationStats = () => {
    const {vaccinationData} = this.state
    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageDetails={vaccinationData.last7daysData}
        />
        <VaccinationByGender
          vaccinationByGenderDetails={vaccinationData.vaccinationByGender}
        />
        <VaccinationByAge
          vaccinationByAgeDetails={vaccinationData.vaccinationByAge}
        />
      </>
    )
  }

  render() {
    return (
      <div>
        <div>
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
            />
            <h1>co-WIN</h1>
          </div>
          <h1>CoWIN Vaccination in India</h1>
          {this.renderViewBasedOnAPIStatus()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
