import React, { useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import Card from "react-bootstrap/Card";

function CardComponent({ cardId }) {
  const [card, setCard] = useState(null);

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
        <Card.Text>Priority: {priority}</Card.Text>
        <Card.Text>Due Time: {due_time}</Card.Text>
        <Card.Text>File: {file}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default CardComponent;
