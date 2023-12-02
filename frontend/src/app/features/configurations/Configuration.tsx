import React from "react";
import useAxiosPrivate from "../../common/useAxiosPrivate";

const Configuration = () => {
  const axiosPrivate = useAxiosPrivate();
  const test = async () => {
    await axiosPrivate.get("users/me/");
    await axiosPrivate.get("users/me/");
  };
  return <button onClick={test}>Test</button>;
};

export default Configuration;
