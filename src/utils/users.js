const users=[]

//add user,removeUser,getUser,getUsersInRoom

const addUser=({id,username,room})=>{
    //clean the data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //validate the user
    if(!username||!room){
        return{
            error:'Username and room are required'
        }
    }

    //Check for existing data

    const existingUser=users.find((user)=>{
        return user.username==username&&user.room==room
    })

    //validate username
    if(existingUser){
        return {
            error:'Username is already in use'
        }
    }

    //Store
    const user={id,username,room}
    users.push(user)
    return {user}
}

const removeUser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id
    })
    if(index!==-1){
        return users.splice(index,1)[0]
    }
}

const getUser=(id)=>{
    const user=users.find((data)=>{
        return data.id===id
    })
    return user
}

const getUsersInRoom=(room)=>{
    const data=users.filter((user)=>{
        //console.log(user)
        return room===user.room
    })
    return data
}


module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}