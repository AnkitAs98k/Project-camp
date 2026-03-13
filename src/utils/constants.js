
//this is a predefind roles
export const userRoleEnum = {
    admin :"admin",
    project_admin :"project_admin",
    member : "member"
}


//this is to convert object into arrat
export const AvailableUserRole = Object.values(userRoleEnum);


//this is all status defined for the task
export const taskStatusEnum ={
    todo:"todo",
    in_progress:"in_progress",
    done:"done"
}


//this is to convert object into array
export const AvailableTaskStatus = Object.values(taskStatusEnum);