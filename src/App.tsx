import { Box, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import { Record } from "./domain/record";
import { useEffect, useState } from "react";
import { fetchRecords } from "./utils/fetchRecords";

export const App = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchRecords()
      .then((data) => setRecords(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <VStack>
      <Heading>シン学習記録一覧アプリ</Heading>
      {records.map((record) => (
        <Box key={record.id}>
          <Text>{record.title}</Text>
          <Text>{record.time}</Text>
        </Box>
      ))}
    </VStack>
  );
};
