import reducer from 'reducers/application'

const SET_DAY = "SET_DAY"
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA"
const SET_INTERVIEW = "SET_INTERVIEW"


describe('Application Reducer', () => {

  it("throws an error with an unsupported type", () => {
    expect(() => reducer({}, {type: null})).toThrowError(
      /tried to reduce with unsupported action type/i
    )
  });
})