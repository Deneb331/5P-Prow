import React, { useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function CardComponent({ cardId, lists, onEditCard, onDeleteCard }) {
  const [card, setCard] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const [cardContent, setCardContent] = useState("");
  const [cardList, setCardList] = useState("");
  const [cardDueTime, setCardDueTime] = useState("");
  const [cardPriorityColor, setCardPriorityColor] = useState(0);
  const [cardFile, setCardFile] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await axiosReq.get(`/cards/${cardId}`);
        setCard(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCard();
  }, [cardId]);

  useEffect(() => {
    if (card) {
      setCardTitle(card.title);
      setCardContent(card.content);
      setCardList(card.list);
      setCardDueTime(card.due_time);
      setCardPriorityColor(card.priority_color);
      setCardFile(card.file);
    }
  }, [card]);

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleUpdateCard = async () => {
    const updatedCard = {
      title: cardTitle,
      content: cardContent,
      list: cardList,
      priority_color: cardPriorityColor,
      file: cardFile,
    };

    if (cardDueTime) {
      const updatedDate = new Date(cardDueTime);
      updatedCard.due_time = updatedDate.toISOString();
    }

    try {
      // Make the update request to update the current card
      await axiosReq.patch(`/cards/${cardId}`, updatedCard);
      // ...handle successful card update
      onEditCard();
    } catch (error) {
      console.log(error);
      // ...handle error updating the card
    }

    handleCloseEditModal();
  };

  const handleFileChange = (e) => {
    setCardFile(e.target.files[0]);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const cancelDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const deleteCard = async () => {
    try {
      // Make the delete request to delete the current card
      await axiosReq.delete(`/cards/${cardId}`).then(()=>{
        console.info('invoke callback');
        onDeleteCard(cardId);
      })
      // ...handle successful card deletion
     
    } catch (error) {
      console.log(error);
      // ...handle error deleting the card
    }
    setShowDeleteConfirmation(false); // Hide the delete confirmation modal
  };

  if (!card) {
    return <div>Loading...</div>;
  }

  const { title, owner, content, priority, due_time, file } = card;

  return (
    <Card>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Owner: {owner}</Card.Subtitle>
        <Card.Text>{content}</Card.Text>
        {due_time && <Card.Text>Due Time: {new Date(due_time).toLocaleString()}</Card.Text>}
        {file && (
          <Card.Text>
            File: <a href={file}>{file}</a>
          </Card.Text>
        )}
        <Card.Text>Priority: {priority}</Card.Text>
        <Button variant="primary" onClick={handleEditClick}>
          Edit
        </Button>
        <Button variant="danger" onClick={handleDeleteClick}>
          Delete
        </Button>
      </Card.Body>

      {/* Edit Card Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="cardTitle">
            <Form.Label>Card Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter card title"
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="cardContent">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter card content"
              value={cardContent}
              onChange={(e) => setCardContent(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="cardList">
            <Form.Label>List</Form.Label>
            <Form.Control
              as="select"
              value={cardList}
              onChange={(e) => setCardList(e.target.value)}
            >
              {lists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.title}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="cardDueTime">
            <Form.Label>Due Time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={cardDueTime ? cardDueTime.slice(0, -1) : ""}
              onChange={(e) => setCardDueTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="cardPriorityColor">
            <Form.Label>Priority Color</Form.Label>
            <Form.Control
              as="select"
              value={cardPriorityColor}
              onChange={(e) => setCardPriorityColor(e.target.value)}
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
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateCard}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirmation} onHide={cancelDeleteConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this card?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDeleteConfirmation}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteCard}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}

export default CardComponent;
