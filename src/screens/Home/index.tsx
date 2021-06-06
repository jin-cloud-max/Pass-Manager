import React, { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';
import { useStorageData } from '../../hooks/storage'

import {
  Container,
  LoginList,
  EmptyListContainer,
  EmptyListMessage
} from './styles';
import { Alert } from 'react-native';

interface LoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
};

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);

  const { loadData } = useStorageData()
  
  async function handleLoadData() {
    try {
      const response = await loadData()
      
      setSearchListData(response)
      setData(response)
      

    } catch (error) {
      console.log(error)
      Alert.alert('Erro ao carregar informações')
    }
  }

  useEffect(() => {
    handleLoadData();
  },[])

  useFocusEffect(
    useCallback(() => {
      handleLoadData();
    }, [])
  );

  function handleFilterLoginData(search: string) {
    

    const filteredSearch = data.filter(data => data.title === search)
   
    setSearchListData(filteredSearch)
  }

  return (
    <Container>
      <SearchBar
        placeholder="Pesquise pelo nome do serviço"
        onChangeText={(value) => handleFilterLoginData(value)}
      />

      <LoginList
        keyExtractor={(item) => item.id}
        data={searchListData}
        ListEmptyComponent={(
          <EmptyListContainer>
            <EmptyListMessage>Nenhum item a ser mostrado</EmptyListMessage>
          </EmptyListContainer>
        )}
        renderItem={({ item: loginData }) => {
          return <LoginDataItem
            title={loginData.title}
            email={loginData.email}
            password={loginData.password}
          />
        }}
      />
    </Container>
  )
}
