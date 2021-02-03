import * as hapi from '@hapi/hapi'
import { authRoute } from './auth'
import { userRoute } from './user'
import { adminRoute } from './admin'
let route: hapi.ServerRoute[] = []
route = route.concat(authRoute)
route = route.concat(userRoute)
route = route.concat(adminRoute)
export default route