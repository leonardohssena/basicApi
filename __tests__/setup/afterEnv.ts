import main from '../../src/app'

beforeAll(async () => {
  await main.startServices()
})

afterAll(async () => {
  await main.stopServices()
})
