import React, { useState, useEffect } from 'react';
import PollModal from './PollModal';
import _isEqual from 'lodash/isEqual';

function CardGridPast({ data, isLoading }) {
  const [selectedPoll, setSelectedPoll] = useState(null); // Состояние для хранения выбранного голосования
  const [filteredPolls, setFilteredPolls] = useState([]); // Состояние для отфильтрованных голосований

  // Функция для обработки нажатия на карточку
  const handleCardClick = (poll) => {
    setSelectedPoll(poll); // Устанавливаем выбранное голосование в состояние
  };

  // Функция для закрытия модального окна
  const handleCloseModal = () => {
    setSelectedPoll(null); // Очищаем выбранное голосование при закрытии модального окна
  };

  // Функция для фильтрации и сортировки карточек
  useEffect(() => {
    if (!data || data.length === 0) return;

    // Преобразование даты из Unix формата
    const parseDate = unixTimestamp => new Date(unixTimestamp * 1000);

    // Фильтрация карточек по просроченной дате
    const filtered = data.filter(poll => parseDate(poll.endTime) < new Date());

    // Сортировка карточек по дате
    filtered.sort((a, b) => parseDate(a.endTime) - parseDate(b.endTime));

    // Проверка изменений в массиве данных перед установкой состояния
    if (!_isEqual(filteredPolls, filtered)) {
      setFilteredPolls(filtered);
    }
  }, [data, filteredPolls]);


  if (isLoading) {
    return <div>Голосования в процессе загрузки</div>;
  } else if (!filteredPolls || filteredPolls.length === 0) {
    return <div>Данных нет</div>;
  } else {
    return (
      <div className="grid">
        {filteredPolls.map((item, index) => {
          return (
            <div key={index} className="card" onClick={() => handleCardClick(item)}>
              <img src={item.imageUrl} alt={`Preview of ${item.title}`} />
              <div className="card-text">
                <h2 className={`gradient-text-${(index % 3) + 1}`}>{item.title} ➜</h2>
                <p>{item.description}</p>
              </div>
              {selectedPoll && <PollModal poll={selectedPoll} onClose={handleCloseModal} />}
            </div>
          );
        })}
      </div>
    );
  }
}

export default CardGridPast;
