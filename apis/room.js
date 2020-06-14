import request from "../utils/request"

export function getRoomPage(data){
  return request.get({
    url: '/pipi/answerRoom/findRoomPage',
    data
  })
}


export function saveRoom(data){
  return request.post({
    url: '/pipi/answerRoom/save',
    data
  })
}