import React, { useState, useEffect} from 'react'
import { ImageBackground, View, Image, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import RNPickerSelect from 'react-native-picker-select';

const Home = () => {
  const [ufs, setUfs] = useState<Item[]>([])
  const [cities, setCities] = useState<Item[]>([])
  const [selectedUf, setselectedUf] = useState('0')
  const [selectedCity, setselectedCity] = useState('0')

  interface IBGEUFResponse {
    sigla: string
  }

  interface IBGECityResponse {
    nome: string
  }

  interface Item {
    label: string,
    value: string
  }

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
        const ufInitials = response.data.map(uf => uf.sigla)
        let list : Item[] = []
        ufInitials.map(uf => list.push({label: uf, value: uf}))
        setUfs(list)
    })
  }, [])

  useEffect(() => {
    if (selectedUf === '0') {
        return
    }

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
        const cityNames = response.data.map(city => city.nome)
        let list : Item[] = [] 
        cityNames.map(city => list.push({label: city, value: city}))
        setCities(list)
    })
  }, [selectedUf])

  const navigation = useNavigation()

  function handleNavigateToPoints() {
    navigation.navigate('Points', {uf: selectedUf, city: selectedCity})
  }

  function handleSelectUf(item: string) {
    setselectedUf(item)
  }

  function handleSelectCity(item: string) {
    setselectedCity(item)
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ImageBackground source={require('../../assets/home-background.png')} style={styles.container} imageStyle={{ width: 274, height: 368 }}>
        <View style={styles.main}>
            <Image source={require('../../assets/logo.png')}/>
            <View>
              <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
              <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
            </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect placeholder={{ label: 'Selecione seu estado', value: '0' }} value={selectedUf} onValueChange={(itemValue) => handleSelectUf(itemValue)} items={ufs}/>
          <RNPickerSelect placeholder={{ label: 'Selecione sua cidade', value: '0' }} value={selectedCity} onValueChange={(itemValue) => handleSelectCity(itemValue)} items={cities}/>

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24}/>
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
    </ImageBackground>
    </KeyboardAvoidingView>
)

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home