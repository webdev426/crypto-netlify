import "./App.css";
import { useState } from "react";
import ADDRESSES from "./constants/ADDRESSES.json";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import {
  connectWallet,
  approveTokenTransfer,
  tokenTransfer,
} from "./utils/interact";
import { Container, Alert } from "react-bootstrap";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [sendAddress, setSendAddress] = useState("");
  const [amount, setAmount] = useState("");
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

  const onSend = async () => {
    await approveTokenTransfer(ADDRESSES.TRANSFER_ADDRESS, amount);
    await tokenTransfer(ADDRESSES.TOKEN_ADDRESS, amount, sendAddress);
  };

  return (
    <div className="App">
      {!walletAddress ? (
        <Button onClick={onClickConnectWallet}>Connect Wallet</Button>
      ) : (
        <>
          <div>{walletAddress}</div>
          <Button onClick={onSend}>Send</Button>
          <InputGroup size="lg">
            <FormControl
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              value={sendAddress}
              onChange={(e) => setSendAddress(e.target.value)}
            />
            <FormControl
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </InputGroup>
        
        </>
      )}
    </div>
  );
}

export default App;
