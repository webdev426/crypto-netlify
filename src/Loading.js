import { Modal, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";


const Loading = ({ show, hideAction }) => {

  return (
    <Modal
      className="loading"
      dialogClassName="loading-dialog"
      contentClassName="loading-content"
      show={show}
      backdrop="static"
      keyboard={false}
      centered
      onHide={hideAction}
    >
      <Spinner animation="border" size="lg" ></Spinner>
    </Modal>
  );
};

export default Loading;
