import {
    Box,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
  } from '@mui/material'
  import { useState, useEffect } from 'react'
  
  export default function Search() {
    const [query, setQuery] = useState('')
    const [category, setCategory] = useState('')
    const [results, setResults] = useState([])
  
    // Load mock torrents from localStorage (simulate DB)
    const getMockTorrents = () => {
      const data = localStorage.getItem('mockUpload')
      return data ? [JSON.parse(data)] : []
    }
  
    const handleSearch = () => {
      const torrents = getMockTorrents()
      const filtered = torrents.filter((t) => {
        const matchQuery = t.title.toLowerCase().includes(query.toLowerCase())
        const matchCategory = category ? t.category === category : true
        return matchQuery && matchCategory
      })
      setResults(filtered)
    }
  
    // re-search whenever input changes
    useEffect(() => {
      handleSearch()
    }, [query, category])
  
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Search Torrents
        </Typography>
  
        <TextField
          fullWidth
          margin="normal"
          label="Search by title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
  
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Movies">Movies</MenuItem>
            <MenuItem value="TV">TV</MenuItem>
            <MenuItem value="Music">Music</MenuItem>
            <MenuItem value="Games">Games</MenuItem>
            <MenuItem value="Books">Books</MenuItem>
          </Select>
        </FormControl>
  
        <Typography variant="h6" sx={{ mt: 3 }}>
          Results:
        </Typography>
  
        {results.length === 0 ? (
          <Typography>No torrents found.</Typography>
        ) : (
          <List>
            {results.map((t, index) => (
              <Box key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={t.title}
                    secondary={
                      <>
                        <Typography variant="body2" component="span">
                          Category: {t.category}
                        </Typography>
                        <br />
                        {t.description.length > 100
                          ? t.description.slice(0, 100) + '...'
                          : t.description}
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>
        )}
      </Box>
    )
  }
  