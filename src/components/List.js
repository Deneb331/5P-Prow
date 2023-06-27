import React, { useState } from "react";
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
  const [newCardList, setNewCardList] = useState("");
  const [newCardDueTime, setNewCardDueTime] = useState("");
  const [newCardPriorityColor, setNewCardPriorityColor] = useState(0);
  const [newCardFile, setNewCardFile] = useState(null);
  const [lists, setLists] = useState([]);

  const [selectedValue, setSelectedValue] = useState('');

  const handleCloseModal = () => {
    setShowModal(false);
    resetFormFields();
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleDropdownChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleCreateCard = async () => {
    const newCard = {
      title: newCardTitle,
      content: newCardContent,
      list: selectedValue,
      // due_time: newCardDueTime,
      priority_color: newCardPriorityColor,
      file: newCardFile,
    };
    const newDate = new Date (newCardDueTime).toISOString();
    newCard.due_time = newDate

    try {
      console.log(newCardList)
      console.log(newCard)
      console.log(selectedValue)
      await axiosReq.post("/cards/", newCard);
      // ...handle successful card creation
    } catch (error) {
      console.log(error);
      console.log(error.response.data)
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
  }, []);

  const resetFormFields = () => {
    setNewCardTitle("");
    setNewCardContent("");
    setNewCardList("");
    setNewCardDueTime("");
    setNewCardPriorityColor(0);
    setNewCardFile(null);
  };

  return (
    <Card className="list-card">
      <Card.Body>
        <Card.Title>{list.title}</Card.Title>
        {list.card_list.map((card, index) => (
          <CardComponent key={index} cardId={card} />
        ))}
      </Card.Body>
      <Card.Footer>
        <Button variant="primary" onClick={handleShowModal}>
          Add Card
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
          <Form.Group controlId="cardList">
            <Form.Label>List</Form.Label>
            <Form.Control
              as="select"
              value={selectedValue}
              onChange={handleDropdownChange}
            >
              {lists.map((list) => (
                <option value={list.id}>{list.title}</option>
              ))}
            </Form.Control>
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
    </Card>
  );
}

export default List;
