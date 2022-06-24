import "./App.css";
import { useState } from "react";
import { Button, InputGroup, FormControl,  } from "react-bootstrap";
import { connectWallet, approveToken, transferToken } from "./utils/interact";
import { Container, Alert } from "react-bootstrap";
import Loading from "./Loading";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [sendAddress, setSendAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const showAlert = (data) => {
    return (
      <Container className="p-4">
        <Alert variant="success">{data}</Alert>
      </Container>
    );
  };

  const onClickConnectWallet = async () => {
    const { event, response } = await connectWallet();
    console.log("event", event);
    switch (event) {
      case "No Wallet":
        showAlert("Please Install the metamask");
        break;
      case "Wrong Chain":
        showAlert("Please Check the chain");
        break;
      case "connected":
        setWalletAddress(response);
        break;
      default:
        break;
    }
  };

  const onApprove = async () => {
    if(sendAddress === "" || amount === 0) 
    {
      alert("Please input values");
      return;
    }
    setLoading(true)
    await approveToken(sendAddress, amount);
    setLoading(false)
  };

  const onReceive = async () => {
    if(amount === 0)
    {
      alert("Please input values");
      return;
    }
    setLoading(true)
    await transferToken(amount);
    setLoading(false)
  };

  const handleCloseLoading = () => {
    setLoading(false);
  }

  return (
    <div className="App">
      {!walletAddress ? (
        <Button onClick={onClickConnectWallet}>Connect Wallet</Button>
      ) : (
        <>
          <div>{walletAddress}</div>
          <Button onClick={onApprove}>Approve</Button>
          <Button onClick={onReceive}>Receive</Button>
          <InputGroup size="lg">
            <FormControl
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              required
              value={sendAddress}
              onChange={(e) => setSendAddress(e.target.value)}
            />
            <FormControl
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              value={amount}
              type="number"
              required
              onChange={(e) => setAmount(e.target.value)}
            />
          </InputGroup>
          <Loading show={loading} hideAction={handleCloseLoading} />
        </>
      )}
    </div>
  );
}

export default App;
