import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import ChatContext from "../context/ChatContext";
import Alert from "../Alert/Alert";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const host = "https://tkdchatserver.herokuapp.com";
  const context = useContext(ChatContext);
  const navigate = useNavigate();
  const { country, getcountry } = context;
  const [alertactive, setalertactive] = useState([false, '', '']);
  const [render, setrender] = useState(true);
  const [messageactive, setmessageactive] = useState(false);
  const [slidePage, setslidePage] = useState(0);
  const [name, setname] = useState('');
  const [gender, setgender] = useState('male');
  const [email, setemail] = useState('');
  const [countryname, setcountryname] = useState('India');
  const [phoneex, setphoneex] = useState('');
  const [phoneno, setphoneno] = useState();
  const [year, setyear] = useState(2000);
  const [month, setmonth] = useState('Jan');
  const [day, setday] = useState(1);
  const [dayno, setdayno] = useState(1);
  const [username, setusername] = useState('');
  const [termscondition, settermscondition] = useState(false);
  const [password, setpassword] = useState('thekoushikdurgas');
  const [passwordstrength, setpasswordstrength] = useState(0);
  const [letterpa, setletterpa] = useState(false);
  const [capitalpa, setcapitalpa] = useState(false);
  const [numberpa, setnumberpa] = useState(false);
  const [lengthpa, setlengthpa] = useState(false);
  const [characterpa, setcharacterpa] = useState(false);
  const [password1, setpassword1] = useState('');
  const [logintogglePassword, setlogintogglePassword] = useState(true);
  const passwordindicator = [{ 'strength': 'Way too Weak ☹', 'inputcolor': '#f42323' }, { 'strength': 'Very Weak ☹', 'inputcolor': 'yellow' }, { 'strength': 'Weak ☹', 'inputcolor': '#f36d0a' }, { 'strength': 'Good ☺', 'inputcolor': '#85c2e0' }, { 'strength': 'Strong ☻', 'inputcolor': '#2bc253' }];
  var validpass = 0;
  const validateEmail = (email) => { return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/); };
  const submitbutton = async (e, a) => {
    e.preventDefault();
    var slide = false;
    if (a === 1) {
      if (name === "") { setalertactive([true, 'Warning', 'First name is mandatory']); }
      else if (gender === "") { setalertactive([true, 'Warning', 'Gender is mandatory']); }
      else if (email === "") { setalertactive([true, 'Warning', 'Email is mandatory']); }
      else if (!validateEmail(email)) { setalertactive([true, 'Warning', 'Invalid Email']); }
      else if (countryname === "") { setalertactive([true, 'Warning', 'Country is mandatory']); }
      else if (phoneno === "") { setalertactive([true, 'Warning', 'Phone no. is mandatory']); }
      else { slide = true; }
    } else if (a === 2) {
      if (username === "") { setalertactive([true, 'Warning', 'Username is mandatory']); }
      else if (password === "") { setalertactive([true, 'Warning', 'Password is mandatory']); }
      else if (password !== password1) { setalertactive([true, 'Warning', 'Password and Confirm Password not same']); }
      else if (!termscondition) { setalertactive([true, 'Warning', 'Check Terms and Condition']); }
      else {
        const response = await fetch(`${host}/api/auth/createuser`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', },
          body: JSON.stringify({ name, username, phone: phoneex + phoneno, picimg: 'https://raw.githubusercontent.com/thekoushikdurgas/TKDstroage/main/gender/'+gender+'.png', country: countryname, dof: day + '/' + month + '/' + year, gender, email, password })
        });
        const json = await response.json();
        if (json['success']) {
          localStorage.setItem('auth-token', json['authtoken']);
          localStorage.setItem('user-img',json['picimg']);
          localStorage.setItem('user-name', json['name']);
          localStorage.setItem('user-username', json['username']);
          setalertactive([true, 'Success', 'Successfully Resgister in']);
          navigate("/", { replace: true });
        }else{
          setalertactive([true, 'Warning', json]);
        }
      }
    }
    if (slide) { setslidePage(a) }
  }
  const changephone = (a) => { country.forEach(function (x) { if (x['name'] === a) { setphoneex(x['mcode']); } }) }
  const checkpassword = (val) => {
    validpass = -1;
    if (val.match(/[a-z]/g)) { setletterpa(true); validpass += 1; } else { setletterpa(false); }
    if (val.match(/[$@$$!%*#?&]/g)) { setcharacterpa(true); validpass += 1; } else { setcharacterpa(false); }
    if (val.match(/[A-Z]/g)) { setcapitalpa(true); validpass += 1; } else { setcapitalpa(false); }
    if (val.match(/[0-9]/g)) { setnumberpa(true); validpass += 1; } else { setnumberpa(false); }
    if (val.length >= 8) { setlengthpa(true); validpass += 1; } else { setlengthpa(false); }
    setpasswordstrength(validpass <= 0 ? 0 : validpass);
  }
  const changedayno = (a, b) => {
    if (b === 'Jan' || b === 'Mar' || b === 'May' || b === 'Jul' || b === 'Aug' || b === 'Oct' || b === 'Dec') { setdayno(31); }
    else if (b === 'Apr' || b === 'Jun' || b === 'Sep' || b === 'Nov') { setdayno(30); }
    else if (b === 'Feb') {
      if (a <= 1917) { if (a % 4 === 0) { setdayno(28); } else { setdayno(29); } }
      else if (a >= 1919) { if ((a % 400 === 0) || (a % 4 === 0 && a % 100 !== 0)) { setdayno(28); } else { setdayno(29); } }
      else { setdayno(14); }
    }
  }
  const getpassword = async (n) => {
    const response = await fetch("https://tkdbackend.herokuapp.com/api/password/" + n, {
      method: 'GET', headers: { 'Content-Type': 'application/json', }
    });
    const json = await response.json();
    setpassword(json[n]);
    setpassword1(json[n]);
    checkpassword(json[n]);
  }
  useEffect(() => {
    if (render) {
      async function fetchData() {
        if (country.length === 0) { getcountry(); }
        else {
          changephone(countryname);
          changedayno(year, month);
          checkpassword(password);
          await getpassword(16);
          setrender(false);
        }
      }
      fetchData();
    }
  }, [country, render, countryname, year, month, password])

  return (
    <>
      <Alert alertactive={alertactive} />
      <div className="lurcard register">
        <h2>Create an Account!</h2>
        <div className="register1">
          <div className="form-outer">
            <div className="silder-form" id="registerid">
              <div className="page slide-page" style={{ marginLeft: `-${slidePage * 25 >= 75 ? 75 : slidePage * 25}%` }}>
                <div id="friststepre">
                  <div className="field">
                    <input type="text" id="name" name="name" value={name} placeholder="Name eg. Koushik" autoComplete="off" required className="inputlo" onChange={(event) => { setname(event.target.value); setusername(event.target.value.replace(' ', '') + '123'); }} />
                  </div>
                  <fieldset>
                    <div className="genderradio errorcontainer">
                      <input type="radio" name="genderre" id="male" value="male" onChange={() => { setgender('male') }} checked={gender === 'male' ? true : false} />
                      <label htmlFor="male" className="fristgenderradio"><i className="fad fa-male" /><span>male</span></label>
                      <input type="radio" name="genderre" id="female" value="female" onChange={() => { setgender('female') }} checked={gender === 'female' ? true : false} />
                      <label htmlFor="female"><i className="fad fa-female" /><span>female</span></label>
                      <input type="radio" name="genderre" id="others" value="others" onChange={() => { setgender('others') }} checked={gender === 'others' ? true : false} />
                      <label htmlFor="others"><i className="fad fa-transgender" /><span>others</span></label>
                    </div>
                  </fieldset>
                  <div className="field">
                    <input type="text" id="reemail" name="reemail" value={email} placeholder="Email Address eg. example@gmail.com" autoComplete="off" required className="inputlo" onChange={(event) => { setemail(event.target.value) }} />
                  </div>
                  <div className="field fieldselect">
                    <select name="myCountry" id="myCountry" value={countryname} onChange={(event) => { setcountryname(event.target.value); changephone(event.target.value); }}>
                      <option value={``}>Select Country</option>
                      {country.map((object, i) =>
                        <option value={object.name} key={i}>{object.name}</option>
                      )}
                    </select>
                  </div>
                  <div className="ingro">
                    <div className="ingroic"><span className="ingrotext" id="ingrotext">{phoneex}</span></div>
                    <div className="field1">
                      <input type="tel" name="rephone" className="ingroin" id="rephone" autoComplete="off" placeholder="Phone" required value={phoneno} onChange={(event) => { setphoneno(event.target.value.replace(/[^\d]/, '')) }} />
                    </div>
                  </div>
                  <div className="field btnbtn">
                    <button className="firstNext next" onClick={(event) => { submitbutton(event, 1) }}>Next</button>
                  </div>
                </div>
                <div className="signup-link">Already have an account? <Link to="/login">Signin now</Link>or<p>Please fill in this form to create an account.</p></div>
              </div>
              <div className="page">
                <div id="Thirdstepre">
                  <div className="field fieldselect">
                    <select name="myYear" id="myYear" style={{ borderRadius: '10px 0 0 10px' }} value={year} onChange={(event) => { setyear(event.target.value); changedayno(event.target.value, month); }}>
                      {(() => {
                        const rows = [];
                        for (let i = 1980; i < (new Date()).getFullYear() + 1; i++) {
                          rows.push(<option value={i} key={i}>{i}</option>);
                        }
                        return rows;
                      })()}
                    </select>
                    <select name="myMonth" id="myMonth" style={{ borderRadius: '0' }} value={month} onChange={(event) => { setmonth(event.target.value); changedayno(year, event.target.value); }}>
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((object, i) =>
                        <option value={object} key={i}>{object}</option>
                      )}
                    </select>
                    <select name="myDay" id="myDay" style={{ borderRadius: '0 10px 10px 0' }} value={day} onChange={(event) => { setday(event.target.value) }}>
                      <option value>Day</option>
                      {(() => {
                        const rows = [];
                        for (let i = 1; i < dayno + 1; i++) {
                          rows.push(<option value={i} key={i}>{i}</option>);
                        }
                        return rows;
                      })()}
                    </select>
                  </div>
                  <div className="field">
                    <input type="text" name="userna" id="userna" autoComplete="off" placeholder="Username eg. ZackGilkes" required className="inputlo" value={username} onChange={(event) => { setusername(event.target.value) }} />
                  </div>
                  <div className="field">
                    <input type={logintogglePassword ? 'password' : 'text'} name="password" id="password" autoComplete="off" placeholder="Password eg. Abc@1234" required className="inputlo" onFocus={() => { setmessageactive(true) }} onBlur={() => { setmessageactive(false) }} value={password} onChange={(event) => { setpassword(event.target.value); checkpassword(event.target.value); }} />
                    <i className={logintogglePassword ? 'fad fa-eye' : 'fad fa-low-vision'} id="togglePassword" onClick={() => { setlogintogglePassword(!logintogglePassword) }} />
                  </div>
                  <div id="message" className={messageactive ? 'active' : ''}>
                    <div className="messagerow">
                      <p><span style={{ color: passwordindicator[passwordstrength]['inputcolor'] }}><b>{passwordindicator[passwordstrength]['strength']}</b></span></p>
                      <p><span className={letterpa ? 'val' : 'inval'}><b>lowercase</b></span></p>
                      <p><span className={capitalpa ? 'val' : 'inval'}><b>uppercase</b></span></p>
                      <p><span className={numberpa ? 'val' : 'inval'}><b>number</b></span></p>
                      <p><span className={lengthpa ? 'val' : 'inval'}><b>8 chars</b></span></p>
                      <p><span className={characterpa ? 'val' : 'inval'}><b>special char</b></span></p>
                    </div>
                  </div>
                  <div className="field">
                    <input type={logintogglePassword ? 'password' : 'text'} name="password1" id="password1" autoComplete="off" placeholder="Comfirm Password" required className="inputlo" value={password1} onChange={(event) => { setpassword1(event.target.value) }} />
                    <i className={logintogglePassword ? 'fad fa-eye' : 'fad fa-low-vision'} id="togglePassword1" onClick={() => { setlogintogglePassword(!logintogglePassword) }} />
                  </div>
                  <fieldset className="terms">
                    <legend>
                      <label className="checkbox1 path d-flex">
                        <input type="checkbox" name="termsre" id="termsre" checked={termscondition} onChange={() => { settermscondition(!termscondition); }} />
                        <svg viewBox="0 0 21 21">
                          <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186">
                          </path>
                        </svg>
                      </label>
                    </legend>
                    <label htmlFor="termsre" className="error" style={{ top: '-16%', display: 'none' }} />
                    <p>By clicking Sign Up, you agree to our <Link to='/' target="_blank">Terms</Link>, <Link to='/' target="_blank">Data Policy</Link>and <Link to='/' target="_blank">Cookie Policy</Link>. You may receive SMS notifications from us and can opt out at any time.</p>
                  </fieldset>
                </div>
                <div className="field btnbtns" style={{ margin: '6px 0 0' }}>
                  <div className="field btnbtn pre">
                    <button className="prev-2 prev" onClick={(event) => { event.preventDefault(); setslidePage(0) }}>Previous</button>
                  </div>
                  <div className="field btnbtn nex">
                    <button className="next-2 next" onClick={(event) => { submitbutton(event, 2) }}>Registration</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}