import Child2 from "./Child2";

const Parent2 = () => {

  // Callback function (this will be called by child)
  const handleMessage = (msg) => {
    alert("Message from Child: " + msg);
  };

  return (
    <>
      <h1>Parent2 Component</h1>

      <Child2
        key1={"hello"}
        key2={500}
        sendData={handleMessage}  // passing function as prop
      />
    </>
  );
};

export default Parent2;