import { JSX, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select, { SingleValue } from "react-select";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { IUser } from "./Register";

type Country = {
  value: string;
  label: JSX.Element;
};

export const countryOptions: Country[] = [
  {
    value: "IN",
    label: (
      <div className="flex items-center gap-1">
        <img
          src="https://flagcdn.com/w40/in.png"
          alt="India Flag"
          className="w-6 h-4 rounded-sm "
        />
        <span>+91</span>
      </div>
    ),
  },
];

export default function Login() {
  const navigate=useNavigate()
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    countryOptions[0]
  );
  const login=useMutation({
    mutationFn:async(data:IUser)=>{
    const res= await axiosInstance.post(`/auth/login`,data);
      return res.data
    },
    onSuccess:(data)=>{
      localStorage.setItem('token',data.accessToken);
      localStorage.setItem('id',data.user._id);
      toast.success(`Login Successfull`);
      setTimeout(()=>{

        navigate(`/question`);
      },2000)
    },
    onError:()=>{
      toast.error(`Something went wrong`);
    }
  })
  const formik = useFormik({
    initialValues: {
      mobile: "",
      password: "",
    },
    validationSchema: Yup.object({
      mobile: Yup.string()
        .matches(/^\d{10}$/, "Mobile number must be 10 digits")
        .required("Mobile number is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters long")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      login.mutate(values)
    },
  });

  return (
    <div className="w-full flex-1 flex-col flex justify-center items-center gap-10">
      <div className="relative inline-block text-[31px] font-semibold text-[var(--text)]">
        <h1 className="relative z-50">Login</h1>
        <span className="absolute left-0 bottom-1 w-full h-2 bg-[var(--secondary)] z-0"></span>
      </div>

      <form className="p-5 flex flex-col shadow-lg" onSubmit={formik.handleSubmit}>
        <label className="text-[18px] font-bold">Mobile Number</label>
        <div className="flex gap-2 flex-row">
          <Select
            options={countryOptions}
            value={selectedCountry}
            onChange={(newValue: SingleValue<Country>) =>
              setSelectedCountry(newValue)
            }
            className="md:w-[110px] w-[75px] text-gray-800 border-2 border-[#c4c4c4] rounded-md mt-2"
            isSearchable={false}
            styles={{
              control: (provided) => ({
                ...provided,
                border: "none",
                boxShadow: "none",
                backgroundColor: "transparent",
              }),
              indicatorSeparator: () => ({ display: "none" }),
              dropdownIndicator: (provided) => ({
                ...provided,
                padding: "2px",
              }),
            }}
          />

          <input
            type="tel"
            placeholder="Enter your phone number"
            className="p-2 md:pl-10 outline-none text-gray-700 border-2 border-[var(--border)] rounded-md mt-2"
            {...formik.getFieldProps("mobile")}
          />
        </div>
        {formik.touched.mobile && formik.errors.mobile ? (
          <div className="text-[var(--red)] text-sm">{formik.errors.mobile}</div>
        ) : null}

        <label className="text-[18px] font-bold mt-4">Password</label>
        <input
          type="password"
          placeholder="Enter Password"
          className="flex-1 p-2 outline-none text-gray-700 border-2 border-[var(--border)] rounded-md mt-2"
          {...formik.getFieldProps("password")}
        />
        {formik.touched.password && formik.errors.password ? (
          <div className="text-[var(--red)] text-sm">{formik.errors.password}</div>
        ) : null}

        <button
          type="submit"
          className="mt-8 py-2 font-semibold text-[14px] bg-[var(--primary)] text-white border-2 border-[var(--primary)] hover:bg-transparent hover:text-[var(--primary)]] rounded-md"
        >
          Login
        </button>
        <small className="text-center mt-5">
          Don't have an account? {" "}
          <Link to="/register" className="text-blue-600">
            Register Now
          </Link>
        </small>
      </form>
    </div>
  );
}
