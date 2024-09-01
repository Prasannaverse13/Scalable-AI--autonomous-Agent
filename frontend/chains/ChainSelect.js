import React from "react";
import axios from "axios";
import { FormHelperText, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

import { AsyncAPIObjectSelect } from "components/AsyncAPIObjectSelect";
import { MenuList } from "components/select/MenuList";
import { SingleValue } from "components/select/SingleValue";
import { Option } from "components/select/Option";
import { LinkText } from "components/LinkText";
import { EditorViewState } from "chains/editor/contexts";

const toOption = (chain) => ({
  label: chain.name,
  value: chain.id,
  help: chain.description,
});

const fetchOptions = async (url, inputValue) => {
  try {
    const fullUrl = inputValue ? `${url}&search=${inputValue}` : url;
    const response = await axios.get(fullUrl);
    const options = response.data.objects.map(toOption);
    return options;
  } catch (error) {
    console.error("Error fetching options:", error);
    return [];
  }
};

const getDetail = async (id) => {
  const response = await axios.get(`/api/chains/${id}`);
  return toOption(response.data);
};

export const ChainSelect = ({ onChange, value, is_agent }) => {
  const getOptions = React.useCallback(
    async (inputValue) => {
      return fetchOptions(
        `/api/chains/?is_agent=${is_agent === true}&limit=20`,
        inputValue
      );
    },
    [is_agent]
  );

  return (
    <AsyncAPIObjectSelect
      getOptions={getOptions}
      getDetail={getDetail}
      onChange={onChange}
      value={value}
      components={{
        MenuList,
        Option,
        SingleValue,
      }}
    />
  );
};

export const ChainSelectHelp = ({ value, field }) => {
  const editor = React.useContext(EditorViewState);

  return (
    <FormHelperText fontSize={"xs"}>
      <Text as={"span"}>{field.description}</Text>
      {value && (
        <LinkText
          fontSize={"xs"}
          pl={"3px"}
          onClick={() => editor.selectOrOpenChain(value)}
        >
          Open <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
        </LinkText>
      )}
    </FormHelperText>
  );
};

ChainSelect.help = ChainSelectHelp;
