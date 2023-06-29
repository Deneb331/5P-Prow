import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import CardComponent from "./Card";
import { axiosReq } from "../api/axiosDefaults";

function List({ list }) {
  const [showModal, setShowModal] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardContent, setNewCardContent] = useState("");
  const [newCardDueTime, setNewCardDueTime] = useState("");
  const [newCardPriorityColor, setNewCardPriorityColor] = useState(0);
  const [newCardFile, setNewCardFile] = useState(null);
  const [lists, setLists] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [cardList, setCardList] = useState(list.card_list);

  const handleCloseModal = () => {
    setShowModal(false);
    resetFormFields();
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCreateCard = async () => {
    const newCard = {
      title: newCardTitle,
      content: newCardContent,
      list: list.id,
      priority_color: newCardPriorityColor,
      file: newCardFile,
    };
    const newDate = new Date(newCardDueTime).toISOString();
    newCard.due_time = newDate;

    try {
      await axiosReq.post("/cards/", newCard).then((response) => {
        const currentCardList = cardList;
        currentCardList.push(response.data.id);
        setCardList(currentCardList);
      });
      // ...handle successful card creation
      
    } catch (error) {
      console.log(error);
      console.log(error.response.data);
    }

    handleCloseModal();
  };

  const handleFileChange = (e) => {
    setNewCardFile(e.target.files[0]);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchLists = async () => {
      try {
        const response = await axiosReq.get(`/lists/?board=${list.board}`);
        if (isMounted) {
          const fetchedLists = response.data.results.map((list) => ({
            ...list,
            cards: [],
          }));
          setLists(fetchedLists);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchLists();

    return () => {
      isMounted = false;
    };
  }, [list.board]);

  const resetFormFields = () => {
    setNewCardTitle("");
    setNewCardContent("");
    setNewCardDueTime("");
    setNewCardPriorityColor(0);
    setNewCardFile(null);
  };

  const deleteList = async (listId) => {
    try {
      // Make the delete request to delete the current list
      await axiosReq.delete(`/lists/${listId}`);
      // ...handle successful list deletion
    } catch (error) {
      console.log(error);
      // ...handle error deleting the list
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const cancelDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const onDeleteCard = (cardId)=>{
    const currentCardList = cardList.filter((id)=>{
      return id !== cardId;
    });
    setCardList(currentCardList);
  };

  const deleteConfirmation = async () => {
    try {
      // Make the delete request to delete the current list
      await deleteList(list.id);
      // ...handle successful list deletion
    } catch (error) {
      console.log(error);
      // ...handle error deleting the list
    }

    setShowDeleteConfirmation(false);
  };

  return (
    <Card className="list-card">
      <Card.Body>
        <Card.Title>{list.title}</Card.Title>
        {cardList.map((cardId, index) => (
          <CardComponent key={index} cardId={cardId} lists={lists} onDeleteCard={onDeleteCard} />
        ))}
      </Card.Body>
      <Card.Footer>
        <Button variant="primary" onClick={handleShowModal}>
          Add Card
        </Button>
        <Button variant="danger" onClick={handleDeleteClick}>
          Delete List
        </Button>
      </Card.Footer>

      {/* Modal for creating a new card */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="cardTitle">
            <Form.Label>Card Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter card title"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="cardContent">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter card content"
              value={newCardContent}
              onChange={(e) => setNewCardContent(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="cardDueTime">
            <Form.Label>Due Time</Form.Label>
            <Form.Control
              type="date"
              value={newCardDueTime}
              onChange={(e) => setNewCardDueTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="cardPriorityColor">
            <Form.Label>Priority Color</Form.Label>
            <Form.Control
              as="select"
              value={newCardPriorityColor}
              onChange={(e) => setNewCardPriorityColor(e.target.value)}
            >
              <option value={0}>Low</option>
              <option value={1}>Medium</option>
              <option value={2}>High</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="cardFile">
            <Form.Label>Upload File</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateCard}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirmation} onHide={cancelDeleteConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Delete List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this list?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDeleteConfirmation}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteConfirmation}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}

export default List;
