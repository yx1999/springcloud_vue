var state = sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')) : {
  userId: null,
  username: null,
  collapsed: false,
  svrId: null,
  chcId:null,
  index:null,
  id:null,
  name:null,
  order:{},
  orderId:null,
  odrDate:null,
  odrAddr:null,
  odrStatus:null,
  jwt:null
}
export default state
