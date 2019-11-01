import {
  SOME_MUTATION
} from './mutation-types.js'


export default {
  [SOME_MUTATION](state) {
    state.count++
  },
  setHelloName: function(state, payload) {
    state.helloName = payload.helloName;
  },
  setUserId: function(state, payload) {
    state.userId = payload.userId;
  },
  setUserName: function(state, payload) {
    state.username = payload.username;
  },
  setSvrId: function(state, payload) {
    state.svrId = payload.svrId;
  },
  setChcId: function(state, payload) {
    state.chcId = payload.chcId;
  },
  clear: function(state) {
    for (let attrName in state) {
      console.log(attrName + "=" + state[attrName]);

      state[attrName] = null;
    }
  },
  setCollapsed: function(state, payload) {
    state.collapsed = payload.collapsed;
  },
  setJwt: function(state, payload) {
    state.jwt = payload.jwt;
  },
  setIndex:function (state,payload) {
  	state.index=payload.index;
  },
  setId:function (state,payload) {
  	state.id=payload.id;
  },
  setName:function (state,payload) {
  	state.name=payload.name;
  },
  setOrder:function (state,payload) {
  	state.order=payload.order;
  },
  SetodrDate:function (state,payload) {
  	state.odrDate=payload.odrDate;
  },
  setOrderId:function (state,payload) {
  	state.orderId=payload.orderId;
  },
  setodrAddr:function (state,payload) {
  	state.odrAddr=payload.odrAddr;
  },
  setodrStatus:function (state,payload) {
  	state.odrStatus=payload.odrStatus;
  }
}
