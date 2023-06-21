const mapAlbumToModel = (data) => {
  const songs = data.reduce((acc, row) => {
    if (row.song_id != null && row.title != null && row.performer != null) {
      acc.push({
        id: row.song_id,
        title: row.title,
        performer: row.performer,
      });
    }
    return acc;
  }, []);
  return {
    id: data[0].id,
    name: data[0].name,
    year: data[0].year,
    songs: songs ?? '',
  };
};

module.exports = {mapAlbumToModel};
