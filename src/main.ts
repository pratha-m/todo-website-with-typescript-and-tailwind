interface TodoType{
    title:string,
    isCompleted:boolean,
    readonly id:string
}
const todoForm=document.getElementById("todoForm") as HTMLFormElement;
const getTodos=()=>{
    const localTodos=localStorage.getItem("mytodos");

    if(localTodos) return JSON.parse(localTodos);

    return [];
}
let todos:TodoType[]=getTodos();
const generateRandomId=()=>{    
    let randId:TodoType["id"]="10000000000000";
    let findIdIndex=1;
    while(findIdIndex!=-1){
        randId=String(Math.random()*1000000000000000);
        findIdIndex=todos.findIndex((eachTodo)=>eachTodo.id===randId);
    }
    return randId;
}
const saveTodos=(todos:TodoType[])=>{
   localStorage.setItem("mytodos",JSON.stringify(todos));
}
todoForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const todoInput=document.getElementById("todoInput") as HTMLInputElement;
    const eachTodo:TodoType={
        title:todoInput.value,
        isCompleted:false,
        id:generateRandomId()
    }
    todos.push(eachTodo);
    saveTodos(todos);
    renderTodos(todos);
})
const renderTodos=(todos:TodoType[])=>{
    const todosContainer=document.getElementById("todosContainer") as HTMLDivElement;
    todosContainer.innerText="";
    todos.forEach((eachTodo)=>{
        const {isCompleted,title,id}=eachTodo;
        todosContainer.insertAdjacentElement("beforeend",eachTodoHtml(title,isCompleted,id));
    })
}
function deleteTodo(id:TodoType["id"]){
    todos=todos.filter((eachTodo)=>eachTodo.id!==id);
    saveTodos(todos);
    renderTodos(todos)
}
function completeTodo(id:TodoType["id"]){
    todos=todos.map((eachTodo)=>{
        if(eachTodo.id===id){
            eachTodo.isCompleted=!eachTodo.isCompleted;
        }   
        return eachTodo
    });
    saveTodos(todos);
    renderTodos(todos);
}
function editTodo(id:TodoType["id"]){
    let editText=document.getElementById(`eachTodoText${id}`) as HTMLDivElement;
    if(editText.contentEditable==="true"){
        editText.setAttribute("contenteditable","false")
        editText.classList.remove("border-solid","border-blue-600","border","rounded-md","p-1")
        todos=todos.map((eachTodo)=>{
            if(eachTodo.id===id) eachTodo.title=editText.innerText || eachTodo.title;
            return eachTodo;
        })
        saveTodos(todos);
        renderTodos(todos);
    } 
    else{
        editText.setAttribute("contenteditable","true")
        editText.classList.add("border-solid","border-blue-600","border","rounded-md","p-1")
    }
}
function editEnterKey(event:KeyboardEvent,id:TodoType["id"]){
    event.key==="Enter" && editTodo(id);
}
const eachTodoHtml=(title:TodoType["title"],isCompleted:TodoType["isCompleted"],id:TodoType["id"]):HTMLElement=>{
    const htmlString=`
        <div id="eachTodo" class="w-4/5 flex justify-between shadow-md shadow-blue-200 p-4">
            <div contenteditable="false" onkeydown="editEnterKey(event,'${id}')" id="eachTodoText${id}" class="outline-none w-11/12 ${isCompleted?'line-through':''}">${title}</div>
            <div id="eachTodoBtns" class="h-6 flex px-1">
                <input type="checkbox" id="checkBtn" class="w-5 hover:bg-gray-200" onChange="completeTodo('${id}')" ${isCompleted?"checked":""} ></input>
                <button id="deleteBtn" class="w-6 hover:bg-gray-200" onclick="deleteTodo('${id}')"><i class="fas fa-solid fa-trash"></i></button>
                <button id="editBtn" class="w-6 hover:bg-gray-200" onclick="editTodo('${id}')"><i class="fas fa-solid fa-pen"></i></button>
            </div>
        </div>`
    const parser=new DOMParser();
    const doc=parser.parseFromString(htmlString,"text/html");
    return doc.body.firstElementChild as HTMLElement;
}  
window.completeTodo=completeTodo;
window.deleteTodo=deleteTodo;
window.editTodo=editTodo;
window.editEnterKey=editEnterKey;
renderTodos(todos);