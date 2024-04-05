import React, { useEffect, useRef, useState } from "react";
//react icons
import { GrUserAdmin } from "react-icons/gr";
import { FiPlus } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { FiAlignJustify } from "react-icons/fi";
import { ImExit } from "react-icons/im";
import { MdDeleteForever } from "react-icons/md";
import { TbDeviceTabletPlus } from "react-icons/tb";
//use form
import { useForm } from "react-hook-form";
//react toastify alerts css
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//contex pages
import { SuperContex } from "./contex/supercontex";
import Pagination from "@mui/material/Pagination";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
//axios
import axios from "axios";
//rodal
import Rodal from "rodal";
import "rodal/lib/rodal.css";

export default function Drivers() {
  // BaseUrl = "http://5.39.92.50:9999";
  const BaseUrl = SuperContex().BaseUrl;
  let myref = useRef();
  let typeRef = useRef();
  let navigate = useNavigate();
  let isOpen = SuperContex().isOpen;
  let setIsOpen = SuperContex().setIsOpen;
  const driverAdmins = SuperContex().driverAdmins;
  let tokenLocal=localStorage.getItem('token');
  let [nameAdmin, setNameAdmin] = useState("default");
  let [driverStatus, SetDriverStatus] = useState(false);
  let [deviceStatus,setDeviceStatus]=useState(false)
  let [noticeDel, setNoticeDel] = useState(true);
  let [noticeSearch, setNoticeSearch] = useState(true);
  let [limit, setLimit] = useState(10);
  let [countDrivers, setCountDrivers] = useState(0);
  let [offset, setoffset] = useState(1);
  let [exit, setExit] = useState(false);
  let [keyupRef, setKeyupRef] = useState("");
  let [data, setData] = useState([]);
  let [drivers, setDrivers] = useState([]);
  const { register, handleSubmit, reset } = useForm(
  //   {
  //   shouldUseNativeValidation: true,
  // }
  );
  // get drivers and set drivers to array
  useEffect(() => {
    if (noticeSearch) {
      axios
        .get(`${BaseUrl}/user/get-list?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${tokenLocal}`,
          },
        }
        )
        .then((res) => {
          setCountDrivers(res.data.data.count);
          setDrivers(res.data.data.drivers);
        })
        .catch((err) => {
          console.log(err, "get drivers");
        });
    } else {
      handleSearch();
    }
  }, [offset, limit, noticeDel, noticeSearch]);

  //get admin name login name

  useEffect(() => {
    let tokenLocal = localStorage.getItem("token");
    axios
      .get(`${BaseUrl}/admin/get/info`, {
        headers: {
          Authorization: `Bearer ${tokenLocal}`,
        },
      })
      .then((res) => {
        setNameAdmin(res.data.data.admins[0].login);
      });
  });

  // take data for type device FMB920
  useEffect(() => {
    axios.get(`${BaseUrl}/devicetype/get-list-device-type`,
    {
      headers: {
        Authorization: `Bearer ${tokenLocal}`,
      },
    }
    ).then((res) => {
      // console.log(res.data.data);
      setData(res.data.data);
    });
  }, []);

  function changeLimit(e) {
    setLimit(e.target.value);
    setoffset(1);
  }

  function handleChange(e, page) {
    setoffset(page);
  }

  function handleSearch() {
    if (myref.current.value.trim() == "") {
      setNoticeSearch(true);
      // setoffset(2);
    } else {
      let obj = {
        firstname: myref.current.value,
        limit: 10,
        offset: offset,
      };
      axios.post(`${BaseUrl}/user/search`, obj,
      {
        headers: {
          Authorization: `Bearer ${tokenLocal}`,
        },
      }
      ).then((res) => {
        if (res.data.data.drivers!=null) {
          setCountDrivers(res.data.data.count);
          setDrivers(res.data.data.drivers);
        }else{
          setCountDrivers(0);
          setDrivers([]);
        }
        setNoticeSearch(false);
      });
    }
  }

  function delDriver(item) {
    console.log(item.id);
    axios
      .delete(`${BaseUrl}/user/${item.id}`,
      {
        headers: {
          Authorization: `Bearer ${tokenLocal}`,
        },
      }
      )
      .then(() => {
        toast.success(`🦄 ${item.firstname} Succesfully Deleted !`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setNoticeDel(!noticeDel);
      })
      .catch((err) => {
        console.log(err, "deleting drive error ");
      });
  }

  function backLogin(params) {
    localStorage.removeItem("token");
    navigate("/");
  }

  function handleReset(params) {
    document.getElementById('inputName').value=""; 
    document.getElementById('inputType').value=""; 
    document.getElementById('inputAddress').value=""; 
    document.getElementById('inputUniqueId').value=""; 
  }

  function Submit(data) {
    let newObj={
      device_type_id:data.device_type_id ,
      driver_id:data.driver_id ,
      imei: data.imei,
      ip_address:data.ip_address ,
      name:data.name 
    }
    axios
      .post(`${BaseUrl}/device/create`,newObj, 
      {
        headers: {
          Authorization: `Bearer ${tokenLocal}`,
        },
      }
      )
      .then((res) => {
        handleReset();
      })
      .catch((err) => {
        console.log(err, "error sending data");
      });
  }

  function handleKeyUp(e) {
    setKeyupRef(e.target.value);
  }

  function handleType(item) {
    let inp = document.getElementById("inputType");
    inp.value = item;
    setKeyupRef("");
  }

 function submitDevice(data) {
  console.log(data.nameDevice);
  let newObj={
    name:data.nameDevice
  }
  axios.post(`${BaseUrl}/devicetype/create-device-type`,newObj,
  {
    headers: {
      Authorization: `Bearer ${tokenLocal}`,
    },
  }
  ).then(res=>{
    console.log(res.data);
    reset();
  }).catch(err=>{
    console.log(err);
  })
 }

  return (
    <div className="driverPage">
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
            <h4>Haydovchilar ro'yxati</h4>
          </div>

          <div className="col-6 topRightAdminIcon">
            <h4>{nameAdmin}</h4>
            <h5 onClick={() => setExit(!exit)} className="topRightAdminIconH4">
              <GrUserAdmin />
            </h5>
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
              type="text"
              placeholder="search name"
              className="form-control w-75"
              ref={myref}
            />
            <button className="searchButton" onClick={handleSearch}>
              <IoIosSearch />
            </button>
          </div>
           {/* add device rodal ------------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
          <Rodal
              height={200}
              width={300}
              visible={deviceStatus}
              onClose={() => setDeviceStatus(!deviceStatus)}
              >
              <form onSubmit={handleSubmit(submitDevice)}>
                <div className="addDeviceRodal">
                  <h4>add device name</h4>
                <label htmlFor="nameDevice">Name</label>
                  <input
                    {...register("nameDevice")}
                    required
                    id="nameDevice"
                    type="text"
                    placeholder="example FMB920"
                    className="form-control"
                  />
                  <button>save</button>
                </div>
              </form>
            </Rodal>
          <div className="col-6 addDriverIcon"> 
          <button className="addDevice" onClick={()=>setDeviceStatus(!deviceStatus)}><TbDeviceTabletPlus/></button>
            {/* addDriver rodal---------------------------------------------------------------------*/}
            <Rodal
              height={420}
              width={350}
              visible={driverStatus}
              onClose={() => SetDriverStatus(!driverStatus)}
            >
             
              <form onSubmit={handleSubmit(Submit)}>
                <div className="rodalo">
                  <h4>attach device</h4>

                  <label htmlFor="inputSelect">driver</label>

                  <select
                    id="inputSelect"
                    className="form-select"
                    {...register("driver_id")}
                  >
                    <option>choose...</option>
                    {drivers.map((item) => (
                      <option value={item.id} key={uuid()}>
                        {item.firstname}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="inputName">Name</label>
                  <input
                    {...register("name")}
                    required
                    id="inputName"
                    type="text"
                    placeholder="name device"
                    className="form-control"
                  />
                  <label htmlFor="inputType">Type</label>
                  <input
                    onKeyUp={handleKeyUp}
                    {...register("device_type_id")}
                    required
                    id="inputType"
                    type="text"
                    placeholder="type device"
                    className="form-control"
                  />
                  {/* sort elements from type axios  */}
                  <div className="searchType">
                    {data != null &&
                      data
                        .filter((item, index) => {
                          return (
                            keyupRef &&
                            item.name
                              .toLowerCase()
                              .includes(keyupRef.toLocaleLowerCase())
                          );
                        })
                        .map((item) => (
                          <p key={uuid()} onClick={() => handleType(item.id)}>
                            {item.name}
                          </p>
                        )) }
                  </div>

                  <label htmlFor="inputAddress">Address</label>
                  <input
                    {...register("ip_address")}
                    required
                    type="number"
                    placeholder="address server"
                    className="form-control"
                    id="inputAddress"
                  />
                  <label htmlFor="inputUniqueId">Unique Id</label>
                  <input
                    {...register("imei")}
                    required
                    type="number"
                    placeholder="imei "
                    className="form-control"
                    id="inputUniqueId"
                  />
                  <button className="btn btn-success">Submit</button>
                </div>
              </form>
            </Rodal>
            {/* rodal end--------------------------------------------------------------- */}
            <button className="plusIcon plusIconColor" onClick={()=>SetDriverStatus(!driverStatus)}>
              <p>device</p> <FiPlus />
            </button>
          </div>
        </div>
        <div className="row tableRow">
          <table className="table table-hover table-striped">
            <thead>
              <tr className="tableTr">
                <th>t/r</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone Number</th>
                <th>Del</th>
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
                    <td>{item.lastname}</td>
                    <td>{item.phone}</td>
                    <td onClick={() => delDriver(item)} className="tdDel">
                      <MdDeleteForever />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <ToastContainer />
          
        </div>
        {
          countDrivers > 10 &&
          <div className=" row paginationCard ">
           <div className="col-12 col-md-4 ">
            {countDrivers} all {countDrivers< limit ? countDrivers : limit} is showing...
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
         }
        {/* container div bottom */} 
      </div>
    </div>
  );
}
