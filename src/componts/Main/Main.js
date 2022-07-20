/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React from 'react';
import Loading from "../Loading/Loading";
import { useNavigate } from "react-router-dom";
import ChatContext from "../context/ChatContext";
import Alert from "../Alert/Alert";
import './main.css';

export default function Main() {
  const host = "http://localhost:3001";
  const navigate = useNavigate();
  const context = React.useContext(ChatContext);
  const { formatDate } = context;
  const [alertactive, setalertactive] = React.useState([false, '', '']);
  const [render, setrender] = React.useState(true);
  const [taskrender, settaskrender] = React.useState(false);
  const [taskheader, settaskheader] = React.useState('');
  const [tasksource, settasksource] = React.useState('');
  const [taskdescription, settaskdescription] = React.useState('');
  const [taskdate, settaskdate] = React.useState('');
  const [taskdatemin, settaskdatemin] = React.useState('');
  const [sendfriend, setsendfriend] = React.useState('');
  const [tasksearch, settasksearch] = React.useState('');
  const [taskfocus, settaskfocus] = React.useState(false);
  const [taskList, settaskList] = React.useState([]);
  const [task2List, settask2List] = React.useState([]);
  var d1;
  const gettask = async () => {
    if (localStorage.getItem('auth-token') !== '') {
      const response = await fetch(`${host}/api/task`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": localStorage.getItem('auth-token')
        }
      });
      const json = await response.json();
      if (json['success']) {
        settaskList(json['task']);
        settaskrender(json['success']);
      }
    }
  }
  const newTask = async () => {
    d1 = new Date();
    if (taskheader.trim() !== '') {
      if (localStorage.getItem('auth-token') !== '') {
        const response = await fetch(`${host}/api/task`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "auth-token": localStorage.getItem('auth-token'),
            "contactid": '62687cbd1f1755148e37214e'
          },
          body: JSON.stringify({ name: taskheader, source: tasksource, description: taskdescription, date: taskdate })
        });
        const json = await response.json();
        if (json['success']) {
          settaskList([...taskList, json['task']]);
          settask2List([...taskList, json['task']]);
          settaskheader('');
          settasksource('');
          settaskdescription('');
          settaskdate(formatDate(d1, "yyyy-MM-dd"));
          settaskfocus(false);
          setalertactive([true, 'Success', 'Successfully added task']);
        } else {
          setalertactive([true, 'Warning', 'server gave error']);
        }
      }
    } else {
      setalertactive([true, 'Warning', 'task is empty']);
    }
  }
  const deleteitem = (index) => {
    settaskList(taskList.filter(function (x) { if (x['id'] !== index) { return x; } }));
    settask2List(searchtask(tasksearch, taskList.filter(function (x) { if (x['id'] !== index) { return x; } })));
    // localStorage.setItem("localtask", JSON.stringify(taskList.filter(function (x) { if (x['id'] !== index) { return x; } })));
  }
  const searchtask = (task, arr) => {
    return taskheader.trim() !== '' ? arr : arr.filter(function (x) { if (x['task_name'].match(new RegExp(task, "gi"))) { return x; } });
  }
  window.onkeydown = (e) => {
    if (e.which === 13) {
      newTask();
      return false;
    }
  }
  const createapidefault = () => {
    if (localStorage.getItem('auth-token') === null) {
      localStorage.setItem('auth-token', '');
      localStorage.setItem('user-img', '');
      localStorage.setItem('user-name', '');
      localStorage.setItem('user-username', '');
    }
  }
  React.useEffect(() => {
    d1 = new Date();
    if (render) {
      createapidefault();
      if (localStorage.getItem('auth-token') === '') {
        navigate("/login", { replace: true });
      }
      const fetchData = async () => {
        if (!taskrender) {
          await gettask();
        } else {
          settaskdate(formatDate(d1, "yyyy-MM-dd"));
          settaskdatemin(formatDate(d1, "yyyy-MM-dd"));
          settask2List(taskList);
          setrender(false);
        }
      }
      fetchData();
    }
  }, [render, taskrender, taskheader, navigate])
  return (
    <>
      <Alert alertactive={alertactive} />
      <main className="position-absolute m-auto app">
        <div className={`rightside ${taskfocus ? 'active' : ''}`}>
          <div className="searchbar">
            <div className="d-flex align-items-center justify-content-center">
              <input placeholder="Search Task" id="searchtextbox" value={tasksearch} onChange={(event) => { settasksearch(event.target.value); settask2List(searchtask(event.target.value, taskList)); }} />
            </div>
          </div>
          <div className="tablinkrow">
            <button className="tablink active">All</button>
            <button className="tablink">Pending</button>
            <button className="tablink">Completed</button>
            <button className="tablink">Send task</button>
          </div>
          {taskrender ? (
            <div className="todolist">
              <ul className="addedtasklist">
                {task2List.map((t, i) => {
                  return (
                    <li className="p-2" key={i}>
                      <div className="innerli">
                        <div className="innerlihead">
                          <div>{i + 1}</div>
                          <i className="tkd4-iconmonstr-checkbox-20 text-success"></i>
                        </div>
                        <div className="innerlibody">
                          <span>{t.name}</span>
                          <span className="flex-1 mt-2 text-xs"><span className="font-bold">source :-</span>{t.source}</span>
                          <span className="flex-1 mt-2 text-xs"><span className="font-bold">description :-</span>{t.description}</span>
                          <span className="flex-1 mt-2 text-xs"><span className="font-bold">last :-</span>{t.last}</span>
                        </div>
                        <div className="innerlifooter">
                          <span className="flex items-center">
                            <i className="bi bi-clock-history"></i>
                            <span className="ml-2">{t.date}</span>
                          </span>
                          <span className="flex items-center">
                            <i className="fal fa-edit mr-2"></i>
                            <i className="fi fi-recycle-bin-line mr-1 text-danger" onClick={() => { deleteitem(t.id) }}></i>
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (<Loading />)}
        </div>
        <div className="leftside">
          <div className={`tkdtitle1 ${taskfocus ? '' : 'd-none'}`}>Add Task</div>
          <div className={`close ${taskfocus ? '' : 'd-none'}`} onClick={() => { settaskfocus(false) }}><i className="tkd3-close"></i></div>
          <div className={`wrap ${taskfocus ? '' : 'd-none'}`}>
            <div className='attachmentr d-flex align-items-center'>
              <i className="fal fa-smile-wink"></i>
              <i className="tkd4-iconmonstr-paperclip-thin"></i>
            </div>
            <div className='attachmenti'>
              <input type="text" autoFocus placeholder="Write your task..." value={taskheader} onChange={(event) => { settaskheader(event.target.value) }} />
            </div>
            <div className='attachmentl d-flex align-items-center'>
              <i className="brsicon-microphone"></i>
            </div>
          </div>
          <div className={`description ${taskfocus ? '' : 'd-none'}`}>
            <div className="description50">
              <input type="text" placeholder="Task source" value={tasksource} onChange={(event) => { settasksource(event.target.value) }} />
              <input type="date" placeholder="Task date" min={taskdatemin} value={taskdate} onChange={(event) => { settaskdate(event.target.value) }} ></input>
            </div>
            <div className="description50">
              <textarea placeholder="Task description" value={taskdescription} onChange={(event) => { settaskdescription(event.target.value) }}></textarea>
            </div>
          </div>
          <div className={`plans ${taskfocus ? '' : 'd-none'}`}>
            <label className="plan basic-plan" htmlFor="basic">
              <input defaultChecked type="radio" name="plan" id="basic" />
              <div className="plan-content">
                <div className="plan-details">
                  <p>It is for me</p>
                </div>
              </div>
            </label>
            <div className="or">OR</div>
            <label className="plan complete-plan" htmlFor="complete">
              <input type="radio" id="complete" name="plan" />
              <div className="plan-content">
                <div className="plan-details">
                  <p>Send to</p>
                  <select name="myCountry" id="myCountry" value={sendfriend} onChange={(event) => { setsendfriend(event.target.value); }}>
                    <option value={``}>Select Country</option>
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((object, i) =>
                      <option value={object} key={i}>{object}</option>
                    )}
                  </select>
                </div>
              </div>
            </label>
          </div>
          <div className={`taskcontrols`}>
            <div id="addtaskbtn" className='addtaskbtn' onClick={() => { taskfocus ? newTask() : settaskfocus(true) }}>
              <i className="ti ti-plus"></i>
              <span>Add Task</span>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
