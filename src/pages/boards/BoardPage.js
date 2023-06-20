import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import List from "../../components/List";

function Board() {
  const { boardId } = useParams();
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);

  const fetchLists = async () => {
    try {
      const { data } = await axiosReq.get(`/lists/?board=${boardId}`);
      setLists(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCards = async () => {
    try {
      const { data } = await axiosReq.get(`/cards/?board=${boardId}`);
      setCards(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLists();
    fetchCards();
  }, [boardId]);

  return (
    <div>
      <h1>Board</h1>
      {lists.map((list) => (
        <List
          key={list.id}
          list={list}
          cards={cards.filter((card) => card.list === list.id)}
        />
      ))}
    </div>
  );
}

export default Board;
