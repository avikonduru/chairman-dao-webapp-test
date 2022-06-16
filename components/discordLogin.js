import { React } from 'react';
import { Buffer } from 'buffer';

// chakra ui
import {
  Button,
} from '@chakra-ui/react';

function onClick(URL) {
  document.location = URL;
}

function DiscordLogin(props){
  //generate OAuth link w/ appropriate permissions

  //encode state payload through oauth redirect
  const state = {
    guildID: props.guildID,
    inviteGenerator: props.inviteGeneratorID,
    inviteID: props.inviteID,
    action: props.action,
  };
  const stateURL = `&state=${Buffer.from(JSON.stringify(state)).toString(
    'base64'
  )}`;
  const finalURL = `${props.redirectURL}${stateURL}`;

  return (
    <Button
      borderRadius="full"
      bg={'purple.600'}
      _hover={{ bg: 'purple.800' }}
      color="white"
      w="100%"
      onClick={() => {
        onClick(finalURL);
      }}
    >
      Log in with Discord to Continue
    </Button>
  );
};

export default DiscordLogin;