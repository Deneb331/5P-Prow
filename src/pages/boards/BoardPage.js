import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import List from "../../components/List";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function BoardPage() {
  const { id } = useParams();
  const [lists, setLists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCreateList = async () => {
    try {
      const response = await axiosReq.post("/lists/", {
        title: newListTitle,
        board: id,
      });
      setLists([...lists, response.data]);
      handleCloseModal();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchLists = async () => {
      try {
        const response = await axiosReq.get(`/lists/?board=${id}`);
        if (isMounted) {
          console.log("Lists: ", response.data);
          setLists(response.data.results);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchLists();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <div>
      <h1>Board Page</h1>

      {lists.length === 0 ? (
        <p>No lists available.</p>
      ) : (
        lists.map((list) => <List key={list.id} list={list} />)
      )}

      <Button variant="primary" onClick={handleShowModal}>
        Create List
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="listTitle">
            <Form.Label>List Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter list title"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateList}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BoardPage;
