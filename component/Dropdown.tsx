import { View, Text } from 'react-native'
import React from 'react'
import * as DropdownMenu from 'zeego/dropdown-menu'
import RoundedButton from './RoundedButton'
const Dropdown = () => {
  return (

    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            <RoundedButton icon={'ellipsis-horizontal'} text={'More'} onPress={function (): void {
                  throw new Error('Function not implemented.')
              } }   />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
            <DropdownMenu.Item key='statement'>
                <DropdownMenu.ItemTitle>
                    Statement
                </DropdownMenu.ItemTitle>
                <DropdownMenu.ItemIcon ios={{
                    name:'list.bullet.rectangle.fill',
                    pointSize:24
                }} />
            </DropdownMenu.Item>
            <DropdownMenu.Item key='convertor'>
                <DropdownMenu.ItemTitle>
                    Convertor
                </DropdownMenu.ItemTitle>
                <DropdownMenu.ItemIcon ios={{
                    name:'coloncurrencysign.arrow.circlepath',
                    pointSize:24
                }} />
            </DropdownMenu.Item>
            <DropdownMenu.Item key='background'>
                <DropdownMenu.ItemTitle>
                    Background
                </DropdownMenu.ItemTitle>
                <DropdownMenu.ItemIcon ios={{
                    name:'photo.fill',
                    pointSize:24
                }} />
            </DropdownMenu.Item>
            <DropdownMenu.Item key='addaccount'>
                <DropdownMenu.ItemTitle>
                    Add New Account
                </DropdownMenu.ItemTitle>
                <DropdownMenu.ItemIcon ios={{
                    name:'plus.rectangle.on.folder.fill',
                    pointSize:24
                }} />
            </DropdownMenu.Item>
        </DropdownMenu.Content>
    </DropdownMenu.Root>

  )
}

export default Dropdown