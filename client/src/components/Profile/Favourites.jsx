import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Bookcard from '../Bookcard/Bookcard.jsx';
import { getBaseUrl } from '../../utils/config.js';
const Favourites = () => {
  const [favouriteBook, setFavouriteBook] = useState([]);
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  const BASE_URL=getBaseUrl()
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(BASE_URL+"/api/get-favourite-books", { headers });
        setFavouriteBook(response.data.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching favourite books:", error);
      }
    };

    fetch();
  }, []);

  return (
    <div className='grid grid-cols-4 '>
      {Array.isArray(favouriteBook) && favouriteBook.length > 0 ? (
        favouriteBook.map((items, i) => (
          <div key={i}>
            <Bookcard book={items} />
          </div>
        ))
      ) : (
        <p>No favourite books found.</p>
      )}
    </div>
  );
};

export default Favourites;
