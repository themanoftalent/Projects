const newTask = document.getElementById("enter-task");
const TaskList = document.getElementById("Task-List");


function addTask(){

        if (newTask.value === '') { 

            alert('Please enter a task!'); 

        } else {
            let li = document.createElement("li");
            li.innerHTML = newTask.value;
            TaskList.appendChild(li);
            createRemoveButton(li);
        }
        newTask.value='';
       
}

TaskList.addEventListener("click",function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("check")

    }
},false)

function createRemoveButton(TaskList) {
    const removeButton = document.createElement("button");
    removeButton.innerHTML = "\u00d7"
    removeButton.classList.add("remove-btn");
    TaskList.appendChild(removeButton);
    removeButton.addEventListener("click", function() {
        TaskList.remove();
    }); 
}
