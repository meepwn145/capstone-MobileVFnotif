import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ReceiptScreen({ route }) {
  const { gcashNumber, amount } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receipt</Text>
      <Text style={styles.receiptText}>GCash Number: {gcashNumber}</Text>
      <Text style={styles.receiptText}>Amount: {amount}</Text>
      {/* Add more receipt details here if needed */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  receiptText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
