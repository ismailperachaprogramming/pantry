import { Box, Stack, Typography, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLMyx7w6QA5KX5-4wP7VujiRzYxR1vMOU",
  authDomain: "hspantryapp-c482d.firebaseapp.com",
  projectId: "hspantryapp-c482d",
  storageBucket: "hspantryapp-c482d.appspot.com",
  messagingSenderId: "1049855256156",
  appId: "1:1049855256156:web:47128db0a2e8f788b6a899"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  const [items, setItems] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const q = query(collection(db, 'pantry'));
        const querySnapshot = await getDocs(q);
        const fetchedItems = querySnapshot.docs.map(doc => doc.id);
        const itemsWithQuantity = fetchedItems.reduce((acc, item) => {
          acc[item.toLowerCase()] = 1;
          return acc;
        }, {});
        setItems(itemsWithQuantity);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchItems();
  }, []);

  const handleAddItem = () => {
    const newItem = prompt("Enter a new item:").toLowerCase();
    if (newItem) {
      setItems(prevItems => ({
        ...prevItems,
        [newItem]: prevItems[newItem] ? prevItems[newItem] + 1 : 1
      }));
    }
  };

  const handleRemoveItem = (item) => {
    setItems(prevItems => {
      const newItems = { ...prevItems };
      if (newItems[item] > 1) {
        newItems[item] -= 1;
      } else {
        delete newItems[item];
      }
      return newItems;
    });
  };

  return (
    <Box border={"1px solid #333"} display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Box
        width="90vw" // Adjust width to fit within viewport
        maxWidth="800px"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Button variant="contained" color="primary" onClick={handleAddItem} style={{ marginTop: '20px' }}>
          Add
        </Button>
        <Box
          width="100%"
          height="60px"
          bgcolor={"#ADD8E6"}
          display="flex"
          justifyContent={"center"}
          alignItems={"center"}
          mt={2}
        >
          <Typography 
            variant={'h4'} // Adjust font size to be smaller
            color={'#333'} 
            textAlign={'center'}
          >
            Pantry Items
          </Typography>
        </Box>
        {error && (
          <Typography color="error">{error}</Typography>
        )}
        <Box
          width="100%"
          height="60vh" // Adjust height to allow scrolling within this container
          overflow="auto" // Enable scrolling
          border={"1px solid #ccc"}
          mt={2}
        >
          <Stack
            width="100%"
            spacing={2}
          >
            {Object.entries(items).map(([item, quantity]) => (
              <Box
                key={item}
                width="100%"
                height="50px"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor="#f0f0f0"
                borderBottom="1px solid #ccc"
                px={2}
              >
                <Typography
                  variant={'h6'} // Adjust font size to be smaller
                  color={'#333'}
                  textAlign={"center"}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)} - Quantity: {quantity}
                </Typography>
                <Button variant="contained" color="secondary" onClick={() => handleRemoveItem(item)}>
                  Remove
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
