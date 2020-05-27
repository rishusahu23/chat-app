const socket=io()

const $messageForm=document.querySelector('#message-form')
const $messageFormInput=document.querySelector('input')
const $messageFormButton=document.querySelector('button')
const $locationSendButton=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')


//template
const messageTempalte=document.querySelector('#message-template').innerHTML
const locationTemplate=document.querySelector('#location-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

//Options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})


const autoscroll=()=>{
    const $newMessage=$messages.lastElementChild

    const newMessageStyles=getComputedStyle($newMessage)
    const newMesageMargin=parseInt(newMessageStyles.marginBottom)

    const newMessageHeight=$newMessage.offsetHeight+newMesageMargin

   const visibleHeight=$messages.offsetHeight

   const containerHeight=$messages.scrollHeight

   const scrollOffset=$messages.scrollTop+visibleHeight

   if(containerHeight-newMessageHeight<=scrollOffset+1){
       $messages.scrollTop=$messages.scrollHeight
   }

}


socket.on('message',(msg)=>{
    console.log(msg)
    const html=Mustache.render(messageTempalte,{
        username:msg.username,
        msg:msg.text,
        createdAt:moment(msg.createdAt).format('h:m a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage',(messages)=>{
    console.log(messages)
    const html=Mustache.render(locationTemplate,{
        username:messages.username,
        url:messages.url,
        createdAt:moment(messages.createdAt).format('h:m a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})


socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,users
    })
    document.querySelector('#sidebar').innerHTML=html
})



document.querySelector('#message-form').addEventListener('submit',(event)=>{
    event.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')
    const text=event.target.elements.message.value
  
    socket.emit('sendMessage',text,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()

        if(error)
        return console.log(error)
        console.log('message has been deliverd! ')
    })
})



document.querySelector('#send-location').addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('geolocation is not supported by your browser')
    }
    $locationSendButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        const location={
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        }
        socket.emit('sendLocation',location,()=>{
            $locationSendButton.removeAttribute('disabled')
            console.log('location has been sent')
        })
    })
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})