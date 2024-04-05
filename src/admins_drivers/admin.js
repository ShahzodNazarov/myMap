import React, { useEffect, useRef, useState } from "react";
//react toastify alerts css
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
//react icons
import { MdOutlinePersonAddDisabled } from "react-icons/md";
import { SlOrganization } from "react-icons/sl";
import { FiAlignJustify } from "react-icons/fi";
import { FcBusinessman } from "react-icons/fc";
import { IoIosSearch } from "react-icons/io";
import { GrUserAdmin } from "react-icons/gr";
import { FaRecycle } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import { ImExit } from "react-icons/im";
//use form
import { useForm } from "react-hook-form";
//contex pages
import { SuperContex } from "./contex/supercontex";
import Pagination from "@mui/material/Pagination";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
//axios
import axios from "axios";
//rodal
import "rodal/lib/rodal.css";
import Rodal from "rodal";

export default function Admin() {
  let arrAdmins = [];
  let arrDrivers = [];
  let myref = useRef();
  let navigate = useNavigate();
  let isOpen = SuperContex().isOpen;
  let [limit, setLimit] = useState(10);
  let [exit, setExit] = useState(false);
  let [offset, setoffset] = useState(1);
  const BaseUrl = SuperContex().BaseUrl;
  let [small, setSmall] = useState(false);
  let setIsOpen = SuperContex().setIsOpen;
  let [drivers, setDrivers] = useState([]);
  let tokenLocal=localStorage.getItem("token");
  let [noticeEdit,setNoticeEdit]=useState(false);
  let [noticeDel, setNoticeDel] = useState(true);
  let [dataAdmins, setDataAdmins] = useState([]);
  let [dataDrivers, setDataDrivers] = useState([]);
  let [dataSelectOne, setDataSelectOne] = useState("");
  let [dataSelectTwo, setDataSelectTwo] = useState("");
  let [nameAdmin, setNameAdmin] = useState("superadmin");
  let [driverStatus, SetDriverStatus] = useState(false);
  let [noticeSearch, setNoticeSearch] = useState(true);
  let [countDrivers, setCountDrivers] = useState(0);
  let [deviceStatus, setDeviceStatus] = useState(false);
  const { register, handleSubmit, errors, reset } = useForm({
    shouldUseNativeValidation: true,
  });

  useEffect(() => {
    if (noticeSearch) {
      axios
        .get(`${BaseUrl}/admin/get/admins?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${tokenLocal}`,
          },
        }
        )
        .then((res) => {
          setCountDrivers(res.data.data.count);
          setDrivers(res.data.data.admins);
        })
        .catch((err) => {
          console.log(err, "get admins");
        });
    } else {
      handleSearch();
    }
  }, [offset, limit, noticeDel, noticeSearch,noticeEdit]);
  // get admins and drivers for select box attaching admin and drivers together
  useEffect(() => {
    axios
      .get(`${BaseUrl}/user/get-list?limit=${1000}&offset=${1}`)
      .then((res) => {
        for (let i = 0; i < res.data.data.count; i++) {
          arrDrivers.push({
            ...res.data.data.drivers[i],
            label: res.data.data.drivers[i].firstname,
          });
        }
        setDataDrivers(arrDrivers);
      });
      axios
        .get(`${BaseUrl}/admin/get/admins?limit=${1000}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${tokenLocal}`,
          },
        }
        )
      .then((res) => {
        for (let i = 0; i < res.data.data.count; i++) {
          arrAdmins.push({
            ...res.data.data.admins[i],
            label: res.data.data.admins[i].firstname,
          });
        }
        setDataAdmins(arrAdmins);
      });
  }, []);
  // handle search searching admins ----------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  function handleSearch() {
    if (myref.current.value.trim() == "") {
      setNoticeSearch(true);
    } else {
      let firstname = myref.current.value;
      axios
        .get(
          `${BaseUrl}/admin/get/admins?limit=${limit}&offset=${offset}&first_name=${firstname}`,
          {
            headers: {
              Authorization: `Bearer ${tokenLocal}`,
            },
          }
        )
        .then((res) => {
          if (res.data.data.admins != null) {
            setCountDrivers(res.data.data.count);
            setDrivers(res.data.data.admins);
          } else {
            setCountDrivers(0);
            setDrivers([]);
          }
          setNoticeSearch(false);
        });
    }
  }

  function backLogin() {
    localStorage.removeItem("token");
    navigate("/");
  }

  function Submit(data) {
    axios
      .post(`${BaseUrl}/admin/add/admin`, data,
      {
        headers: {
          Authorization: `Bearer ${tokenLocal}`,
        },
      }
      )
      .then((res) => {
        setSmall(false);
        reset();
      })
      .catch((err) => {
        if (err.response.status) {
          setSmall(true);
        } else {
          console.log(err);
        }
      });
  }

  function handleChange(e, page) {
    setoffset(page);
  }

  function changeLimit(e) {
    setLimit(e.target.value);
    setoffset(1);
  }

  function adminSuccess(item) {
    let data={
      id:item.id,
      status: false
    }
    axios.patch(`${BaseUrl}/admin/edit/admin`,data,
    {
      headers: {
        Authorization: `Bearer ${tokenLocal}`,
      },
    }
    ).then(res=>{
      console.log(res.data);
    }).catch(err=>{
      console.log(err);
    });
    setNoticeEdit(!noticeEdit);
  }

  function adminDisable(item) {
    let data={
      id:item.id,
      status: true
    }
    axios.patch(`${BaseUrl}/admin/edit/admin`,data,
    {
      headers: {
        Authorization: `Bearer ${tokenLocal}`,
      },
    }
    ).then(res=>{
      console.log(res.data);
    }).catch(err=>{
      console.log(err);
    });
    setNoticeEdit(!noticeEdit);
  }

  function submitDevice(event) {
    event.preventDefault();
    let obj = {
      admin_id: dataSelectOne,
      driver_id: dataSelectTwo,
    };
    console.log(obj);
  }
  function changeSelectOne(event) {
    setDataSelectOne(event.id);
  }
  function changeSelectTwo(event) {
    setDataSelectTwo(event.id);
  }

  return (
    <div className="admin">
      <div className="container">
        <div className="row driverTop ">
          <div className="col-6 topLeftCard">
            <button
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              <FiAlignJustify />
            </button>
            <h4>Adminlar ro'yxati</h4>
          </div>
          <div className="col-6 topRightAdminIcon">
            <h4 className="h4">{nameAdmin}</h4>
            <h3 onClick={() => setExit(!exit)} className="topRightAdminIconH4">
              <GrUserAdmin />
            </h3>
            {exit && (
              <button onClick={backLogin}>
                {" "}
                <ImExit />
                exit
              </button>
            )}
          </div>
        </div>

        <div className="row inputSearchDriver">
          <div className="col-6 search_button">
            <input
              ref={myref}
              type="text"
              placeholder="Search"
              className="form-control w-75"
            />
            <button className="searchButton" onClick={handleSearch}>
              <IoIosSearch />
            </button>
          </div>
          <div className="col-6 addDriverIcon">
            <button
              className="addDevice"
              onClick={() => setDeviceStatus(!deviceStatus)}
            >
              <SlOrganization /> +
            </button>
            {/* rodal for  select box --------------------------------------------->>>>>>>>>>>>>>>>>>>> */}

            <Rodal
              height={250}
              width={350}
              visible={deviceStatus}
              onClose={() => setDeviceStatus(!deviceStatus)}
            >
              <form onSubmit={submitDevice}>
                <div className="addDeviceRodal">
                  <h4>CHOOSE...</h4>
                  <label htmlFor="labelSelectOne">choose Admin</label>
                  <Select
                    options={dataAdmins}
                    onChange={changeSelectOne}
                    id="labekSekectOne"
                  />
                  <label htmlFor="labelSelectTwo">choose Driver</label>
                  <Select
                    onChange={changeSelectTwo}
                    options={dataDrivers}
                    id="labelSelectTwo"
                  />
                  <button>save</button>
                </div>
              </form>
            </Rodal>

            {/* addDriver rodal---------------------------------------------------------------------*/}
            <Rodal
              height={350}
              width={350}
              visible={driverStatus}
              onClose={() => SetDriverStatus(!driverStatus)}
            >
              <form onSubmit={handleSubmit(Submit)}>
                <div className="rodalo">
                  <h4>attach device</h4>

                  <label htmlFor="inputName">Name</label>
                  <input
                    {...register("firstname")}
                    id="inputName"
                    type="text"
                    placeholder="name admin"
                    className="form-control"
                  />

                  <label htmlFor="inpuPhone">Phone</label>
                  <input
                    {...register("phone")}
                    required
                    id="inputPhone"
                    type="text"
                    placeholder="phone number"
                    className="form-control"
                  />

                  <label
                    htmlFor="inputLogin"
                    className={small ? "errorPassword" : ""}
                  >
                    Login
                  </label>
                  <input
                    {...register("login")}
                    required
                    id="inputLogin"
                    type="text"
                    placeholder="create new login"
                    className="form-control"
                  />

                  <label
                    htmlFor="inputPassword"
                    className={small ? "errorPassword" : ""}
                  >
                    Password
                  </label>
                  <input
                    {...register("password")}
                    required
                    id="inputPassword"
                    type="text"
                    placeholder="enter new password here"
                    className="form-control"
                  />
                  <button className="btn btn-success">Submit</button>
                </div>
              </form>
            </Rodal>
            {/* rodal end--------------------------------------------------------------- */}
            <button
              className="plusIcon plusIconColor"
              onClick={() => SetDriverStatus(!driverStatus)}
            >
              <p>Admin</p> <FiPlus />
            </button>
          </div>
        </div>
        <div className="row tableRow">
          <table className="table table-hover table-striped">
            <thead>
              <tr>
                <th>t/r</th>
                <th>Name</th>
                <th>login</th>
                <th>Phone Number</th>
                <th>status</th>
              </tr>
            </thead>
            <tbody>
              {drivers != null &&
                drivers.map((item, index) => (
                  <tr key={uuid()}>
                    <td>
                      {offset == 1
                        ? index + 1
                        : (offset - 1) * limit + (index + 1)}
                    </td>
                    <td>{item.firstname}</td>
                    <td>{item.login}</td>
                    <td>{item.phone}</td>
                    {item.status ? (
                      <td onClick={() => adminSuccess(item)} className="tdDel">
                        <FcBusinessman />
                      </td>
                    ) : (
                      <td onClick={() => adminDisable(item)} className="tdDel">
                        <MdOutlinePersonAddDisabled />
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>

         
        </div>
        {countDrivers > 10 && (
            <div className=" row paginationCard ">
              <div className="col-12 col-md-4 ">
                {countDrivers} all {countDrivers < limit ? countDrivers : limit}{" "}
                is showing...
              </div>
              <div className="col-10 col-md-4 ">
                <Pagination
                  count={Math.floor(
                    countDrivers % limit == 0
                      ? countDrivers / limit
                      : Math.floor(countDrivers / limit) + 1
                  )}
                  color="success"
                  onChange={handleChange}
                ></Pagination>
              </div>
              <div className="col-2 col-md-4 selectBoxPage">
                <select
                  id="select"
                  className="form-select w-25"
                  onChange={changeLimit}
                >
                  <option value="10">10</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          )}
        {/* div container bottom  */}
      </div>
    </div>
  );
}
