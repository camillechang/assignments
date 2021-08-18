const express = require('express')
const app = express();


let tasklist = [
  {
    "id": 1,
    "description": "task No.1",
    "done": false
  }
  ,
  {
    "id": 2,
    "description": "task No.2",
    "done": false
  },
  {
    "id": 3,
    "description": "task No.3",
    "done": true
  },
]


//return all tasks
app.get('/tasks', function (req, res) {
  console.log('------- Method get all tasks is called');
  // res.send('Hello World');
  res.send(tasklist);
});

//get task by id
app.get('/tasks/:id', function (req, res) {
  console.log('-------- get task by id is called');

  //  use req.query get url instead of req.params
  //   req.query return { id: '2' }
  //   req.query.id return 2.
  console.log("req.query:");
  console.log(req.query);

  //convert falsy values to boolean
  let clientId = req.query.id;
  let idExist = (!!clientId)
  // console.log(idExist);

  //这里有没有更好的办法替换if else嵌套？？？
  if (idExist) {
    let task = getTaskById(clientId);
    console.log(task.isExist);
    if (task.isExist) {
      console.log("===============");
      res.send(task.result);
    }
    else {
      res.status(404).send("No matched result.");
    }
  } else {
    res.status(404).send("No matched result.");
  }
}
);




//create a new task
app.post('/tasks', (req, res) => {
  //convert falsy values to boolean
  let idExist = (!!req.query.id)

  if (idExist) {
    //tried spread opertor, doesnot work for add new element
    //use Array.push();
    const newTask = req.query;
    tasklist.push(newTask);
    console.log("New tasks are:");
    console.log(tasklist);
    res.send(tasklist);
  }
  else {
    res.status(404).send("Please add id.");
  }
});

// update a task
app.put('/tasks/:id', function (req, res) {
  let updatedId = req.query.id;
   //convert falsy values to boolean
  if (!!updatedId) {
   
    let newTask = req.query;
    let resutId = findTaskIndex(updatedId);

    //if cannot find, resultId will return -1
    if (updatedId <= tasklist.length && resutId >= 0) {
      // console.log(tasklist[resutId]);
      tasklist[resutId] = newTask;
      // console.log("--------------");
      // console.log(tasklist[resutId]);
      res.send(tasklist);
    }
    else {
      res.status(404).send("Task not found");
    }

  } else {
    res.status(404).send("Task not found");
  }
}
);



//delete a task
app.delete('/tasks/:id', function (req, res) {
  let updatedId = req.query.id;
  if (!!updatedId) {
    let resutId = findTaskIndex(updatedId);
    if (updatedId <= tasklist.length && resutId >= 0) {
     
      //remove task form list
     tasklist.splice(resutId,1);

      res.send(tasklist);
    }else{
      res.status(404).send("Task not found");
    }
   
  } else {
    res.status(404).send("Task not found");
  }

})



//function part -------
//return two params, one is isExist, one is result
const getTaskById = (taskId => {

  //if you let here, the result will always "cannot find data"
  //使用 let 关键字， 它声明的变量作用域只在循环体内，循环体外的变量不受影响。
  let result = "Cannot find data, please make sure you enter the correct Id!";
  let isExist = false;
  for (let task of tasklist) {

    // taskId is 2, but task['id] is '2';
    if (task['id'].toString() === taskId.toString()) {
      console.log("task----:" + task['id']);
      result = task;
      isExist = true;
    }
  }
  return { result, isExist };
});

const findTaskIndex = (taskId => {
  let objIndex = tasklist.findIndex((obj => obj.id == taskId));
  console.log(objIndex);
  return objIndex;
});


app.listen(3001, () => {
  console.log('Server is listenning on 3001.');

});