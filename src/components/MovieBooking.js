import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
// Install with: npm install qrcode.react

const MovieBooking = () => {
  const movieList = [
    {
      movieName: 'Rocketry: The Nambi Effect',
      ticketRate: '250',
      description:
        'Based on the life of Indian Space Research Org scientist Nambi Narayanan, who was framed for being a spy ',
      shows: ['09.00 AM - 12.00 AM', '12.30 PM - 1.30 PM', ' 1.30 PM - 3.30'],
    },
    {
      movieName: '3 Idiots',
      ticketRate: '300',
      description:
        'Two friends are searching for their long lost companion. They revisit their college days and recall the memories.',
      shows: ['10.00 AM - 12.00 PM', '03.00 PM - 6.00 PM', '05.00 PM - 8.00 PM', '09.00 PM - 11.00 PM'],
    },
    {
      movieName: 'Avangers',
      ticketRate: '500',
      description:
        'Two friends are searching for their long lost companion. They revisit their college days and recall the memories.',
      shows: ['10.00 AM - 12.00 PM', '03.00 PM - 6.00 PM', '05.00 PM - 8.00 PM', '09.00 PM - 11.00 PM', '10.00 PM - 1.00 AM'],
    },
    {
      movieName: 'Dangal',
      ticketRate: '200',
      description:
        'wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games.',
      shows: ['04.00 PM - 07.00 PM'],
    },
    {
      movieName: 'Drishyam 2',
      ticketRate: '240',
      description: 'an investigation and a family which is threatened by it. Will Georgekutty be able to protect his family this time?',
      shows: ['11.00 AM - 02.00 PM', '02.00 PM - 05.00 PM'],
    },
  ];

  const totalRows = 5;
  const seatsPerRow = 8;

  const [selectedMovie, setSelectedMovie] = useState({
    movieName: '',
    description: '',
    ticketRate: '',
    shows: [],
  });
  const [selectedShow, setSelectedShow] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalBill, setTotalBill] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const changeSelectedMovie = (movieObj) => {
    setSelectedShow('');
    setSelectedSeats([]);
    setTotalBill('');
    setBookingConfirmed(false);
    setSelectedMovie({
      movieName: movieObj.movieName,
      ticketRate: movieObj.ticketRate,
      shows: movieObj.shows,
    });
  };

  const changeSelectedShow = (show) => {
    setSelectedShow(show);
    setSelectedSeats([]);
    setTotalBill('');
    setBookingConfirmed(false);
  };

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
    setBookingConfirmed(false);
  };

  const bookTicket = async () => {
    if (!selectedShow || selectedSeats.length === 0) {
      alert('Please select a show and at least one seat.');
      return;
    }
    const total = Number(selectedMovie.ticketRate) * selectedSeats.length;
    setTotalBill(total);

    // Example backend API call placeholder (change URL to your backend endpoint)
    try {
      const response = await fetch('http://localhost:5000/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieName: selectedMovie.movieName,
          showTime: selectedShow,
          seats: selectedSeats,
          totalAmount: total,
        }),
      });

      if (response.ok) {
        setBookingConfirmed(true);
      } else {
        alert('Booking failed, please try again.');
      }
    } catch (error) {
      alert('Error connecting to server.');
      console.error(error);
    }
  };

  return (
    <div className="container mt-3">
      <h3>Select Movie & Show</h3>
      <div className="row">
        {movieList.map((movie, index) => (
          <div className="col-3 pt-1" key={index}>
            <div
              className={`card ${
                selectedMovie.movieName === movie.movieName ? 'border-success' : ''
              }`}
              onClick={() => changeSelectedMovie(movie)}
              style={{ cursor: 'pointer' }}
            >
              <div className={`card-header ${selectedMovie.movieName === movie.movieName ? 'bg-success text-white' : ''}`}>
                {movie.movieName}
              </div>
              <div className="card-body">{movie.description}</div>
              <div className="card-footer">₹{movie.ticketRate}</div>
            </div>
          </div>
        ))}
      </div>

      {selectedMovie.shows.length > 0 && (
        <>
          <h4 className="mt-4">Select Show Time</h4>
          <div className="mb-3">
            {selectedMovie.shows.map((showTiming, idx) => (
              <button
                key={idx}
                className={`btn mx-1 ${
                  selectedShow === showTiming ? 'btn-success' : 'btn-secondary'
                }`}
                onClick={() => changeSelectedShow(showTiming)}
              >
                {showTiming}
              </button>
            ))}
          </div>
        </>
      )}

      {selectedShow && (
        <>
          <h4>Select Seats</h4>
          <div>
            {[...Array(totalRows)].map((_, rowIndex) => (
              <div
                key={rowIndex}
                style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}
              >
                {[...Array(seatsPerRow)].map((_, seatIndex) => {
                  const seatNumber = `${String.fromCharCode(65 + rowIndex)}${seatIndex + 1}`;
                  const isSelected = selectedSeats.includes(seatNumber);
                  return (
                    <button
                      key={seatNumber}
                      onClick={() => toggleSeat(seatNumber)}
                      style={{
                        width: 35,
                        height: 35,
                        margin: 3,
                        backgroundColor: isSelected ? '#28a745' : '#e0e0e0',
                        border: '1px solid #ccc',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                      title={`Seat ${seatNumber}`}
                    >
                      {seatNumber}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-3">
            Selected Seats: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
          </div>

          <button
            className="btn btn-primary mt-3"
            onClick={bookTicket}
            disabled={selectedSeats.length === 0}
          >
            Book Tickets
          </button>
        </>
      )}

      {totalBill && (
        <div className="mt-4">
          <h5>Booking Summary:</h5>
          <p>
            Movie: <b>{selectedMovie.movieName}</b> <br />
            Show: <b>{selectedShow}</b> <br />
            Seats: <b>{selectedSeats.join(', ')}</b> <br />
            Total: <b>₹{totalBill}</b>
          </p>
        </div>
      )}

      {bookingConfirmed && totalBill && (
        <div className="mt-4">
          <h5>Your booking is confirmed!</h5>
          <QRCodeCanvas
            value={JSON.stringify({
              movie: selectedMovie.movieName,
              show: selectedShow,
              seats: selectedSeats,
              total: totalBill,
            })}
            size={180}
            level="H"
            includeMargin={true}
          />
          <p>Scan this QR code at the theater entrance.</p>
        </div>
      )}
    </div>
  );
};

export default MovieBooking;
