/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { User } from "../models";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { DataStore } from "aws-amplify/datastore";
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  runValidationTasks,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function UserCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    username: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    birthdate: "",
    picture: "",
    favoriteSports: [],
    favoriteTeams: [],
    favoritePlayers: [],
  };
  const [username, setUsername] = React.useState(initialValues.username);
  const [email, setEmail] = React.useState(initialValues.email);
  const [address, setAddress] = React.useState(initialValues.address);
  const [city, setCity] = React.useState(initialValues.city);
  const [state, setState] = React.useState(initialValues.state);
  const [zipCode, setZipCode] = React.useState(initialValues.zipCode);
  const [phone, setPhone] = React.useState(initialValues.phone);
  const [birthdate, setBirthdate] = React.useState(initialValues.birthdate);
  const [picture, setPicture] = React.useState(initialValues.picture);
  const [favoriteSports, setFavoriteSports] = React.useState(
    initialValues.favoriteSports
  );
  const [favoriteTeams, setFavoriteTeams] = React.useState(
    initialValues.favoriteTeams
  );
  const [favoritePlayers, setFavoritePlayers] = React.useState(
    initialValues.favoritePlayers
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setUsername(initialValues.username);
    setEmail(initialValues.email);
    setAddress(initialValues.address);
    setCity(initialValues.city);
    setState(initialValues.state);
    setZipCode(initialValues.zipCode);
    setPhone(initialValues.phone);
    setBirthdate(initialValues.birthdate);
    setPicture(initialValues.picture);
    setFavoriteSports(initialValues.favoriteSports);
    setCurrentFavoriteSportsValue("");
    setFavoriteTeams(initialValues.favoriteTeams);
    setCurrentFavoriteTeamsValue("");
    setFavoritePlayers(initialValues.favoritePlayers);
    setCurrentFavoritePlayersValue("");
    setErrors({});
  };
  const [currentFavoriteSportsValue, setCurrentFavoriteSportsValue] =
    React.useState("");
  const favoriteSportsRef = React.createRef();
  const [currentFavoriteTeamsValue, setCurrentFavoriteTeamsValue] =
    React.useState("");
  const favoriteTeamsRef = React.createRef();
  const [currentFavoritePlayersValue, setCurrentFavoritePlayersValue] =
    React.useState("");
  const favoritePlayersRef = React.createRef();
  const validations = {
    username: [{ type: "Required" }],
    email: [{ type: "Required" }],
    address: [],
    city: [],
    state: [],
    zipCode: [],
    phone: [],
    birthdate: [],
    picture: [],
    favoriteSports: [],
    favoriteTeams: [],
    favoritePlayers: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          username,
          email,
          address,
          city,
          state,
          zipCode,
          phone,
          birthdate,
          picture,
          favoriteSports,
          favoriteTeams,
          favoritePlayers,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await DataStore.save(new User(modelFields));
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "UserCreateForm")}
      {...rest}
    >
      <TextField
        label="Username"
        isRequired={true}
        isReadOnly={false}
        value={username}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              username: value,
              email,
              address,
              city,
              state,
              zipCode,
              phone,
              birthdate,
              picture,
              favoriteSports,
              favoriteTeams,
              favoritePlayers,
            };
            const result = onChange(modelFields);
            value = result?.username ?? value;
          }
          if (errors.username?.hasError) {
            runValidationTasks("username", value);
          }
          setUsername(value);
        }}
        onBlur={() => runValidationTasks("username", username)}
        errorMessage={errors.username?.errorMessage}
        hasError={errors.username?.hasError}
        {...getOverrideProps(overrides, "username")}
      ></TextField>
      <TextField
        label="Email"
        isRequired={true}
        isReadOnly={false}
        value={email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              username,
              email: value,
              address,
              city,
              state,
              zipCode,
              phone,
              birthdate,
              picture,
              favoriteSports,
              favoriteTeams,
              favoritePlayers,
            };
            const result = onChange(modelFields);
            value = result?.email ?? value;
          }
          if (errors.email?.hasError) {
            runValidationTasks("email", value);
          }
          setEmail(value);
        }}
        onBlur={() => runValidationTasks("email", email)}
        errorMessage={errors.email?.errorMessage}
        hasError={errors.email?.hasError}
        {...getOverrideProps(overrides, "email")}
      ></TextField>
      <TextField
        label="Address"
        isRequired={false}
        isReadOnly={false}
        value={address}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              username,
              email,
              address: value,
              city,
              state,
              zipCode,
              phone,
              birthdate,
              picture,
              favoriteSports,
              favoriteTeams,
              favoritePlayers,
            };
            const result = onChange(modelFields);
            value = result?.address ?? value;
          }
          if (errors.address?.hasError) {
            runValidationTasks("address", value);
          }
          setAddress(value);
        }}
        onBlur={() => runValidationTasks("address", address)}
        errorMessage={errors.address?.errorMessage}
        hasError={errors.address?.hasError}
        {...getOverrideProps(overrides, "address")}
      ></TextField>
      <TextField
        label="City"
        isRequired={false}
        isReadOnly={false}
        value={city}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              username,
              email,
              address,
              city: value,
              state,
              zipCode,
              phone,
              birthdate,
              picture,
              favoriteSports,
              favoriteTeams,
              favoritePlayers,
            };
            const result = onChange(modelFields);
            value = result?.city ?? value;
          }
          if (errors.city?.hasError) {
            runValidationTasks("city", value);
          }
          setCity(value);
        }}
        onBlur={() => runValidationTasks("city", city)}
        errorMessage={errors.city?.errorMessage}
        hasError={errors.city?.hasError}
        {...getOverrideProps(overrides, "city")}
      ></TextField>
      <TextField
        label="State"
        isRequired={false}
        isReadOnly={false}
        value={state}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              username,
              email,
              address,
              city,
              state: value,
              zipCode,
              phone,
              birthdate,
              picture,
              favoriteSports,
              favoriteTeams,
              favoritePlayers,
            };
            const result = onChange(modelFields);
            value = result?.state ?? value;
          }
          if (errors.state?.hasError) {
            runValidationTasks("state", value);
          }
          setState(value);
        }}
        onBlur={() => runValidationTasks("state", state)}
        errorMessage={errors.state?.errorMessage}
        hasError={errors.state?.hasError}
        {...getOverrideProps(overrides, "state")}
      ></TextField>
      <TextField
        label="Zip code"
        isRequired={false}
        isReadOnly={false}
        value={zipCode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              username,
              email,
              address,
              city,
              state,
              zipCode: value,
              phone,
              birthdate,
              picture,
              favoriteSports,
              favoriteTeams,
              favoritePlayers,
            };
            const result = onChange(modelFields);
            value = result?.zipCode ?? value;
          }
          if (errors.zipCode?.hasError) {
            runValidationTasks("zipCode", value);
          }
          setZipCode(value);
        }}
        onBlur={() => runValidationTasks("zipCode", zipCode)}
        errorMessage={errors.zipCode?.errorMessage}
        hasError={errors.zipCode?.hasError}
        {...getOverrideProps(overrides, "zipCode")}
      ></TextField>
      <TextField
        label="Phone"
        isRequired={false}
        isReadOnly={false}
        value={phone}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              username,
              email,
              address,
              city,
              state,
              zipCode,
              phone: value,
              birthdate,
              picture,
              favoriteSports,
              favoriteTeams,
              favoritePlayers,
            };
            const result = onChange(modelFields);
            value = result?.phone ?? value;
          }
          if (errors.phone?.hasError) {
            runValidationTasks("phone", value);
          }
          setPhone(value);
        }}
        onBlur={() => runValidationTasks("phone", phone)}
        errorMessage={errors.phone?.errorMessage}
        hasError={errors.phone?.hasError}
        {...getOverrideProps(overrides, "phone")}
      ></TextField>
      <TextField
        label="Birthdate"
        isRequired={false}
        isReadOnly={false}
        value={birthdate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              username,
              email,
              address,
              city,
              state,
              zipCode,
              phone,
              birthdate: value,
              picture,
              favoriteSports,
              favoriteTeams,
              favoritePlayers,
            };
            const result = onChange(modelFields);
            value = result?.birthdate ?? value;
          }
          if (errors.birthdate?.hasError) {
            runValidationTasks("birthdate", value);
          }
          setBirthdate(value);
        }}
        onBlur={() => runValidationTasks("birthdate", birthdate)}
        errorMessage={errors.birthdate?.errorMessage}
        hasError={errors.birthdate?.hasError}
        {...getOverrideProps(overrides, "birthdate")}
      ></TextField>
      <TextField
        label="Picture"
        isRequired={false}
        isReadOnly={false}
        value={picture}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              username,
              email,
              address,
              city,
              state,
              zipCode,
              phone,
              birthdate,
              picture: value,
              favoriteSports,
              favoriteTeams,
              favoritePlayers,
            };
            const result = onChange(modelFields);
            value = result?.picture ?? value;
          }
          if (errors.picture?.hasError) {
            runValidationTasks("picture", value);
          }
          setPicture(value);
        }}
        onBlur={() => runValidationTasks("picture", picture)}
        errorMessage={errors.picture?.errorMessage}
        hasError={errors.picture?.hasError}
        {...getOverrideProps(overrides, "picture")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              username,
              email,
              address,
              city,
              state,
              zipCode,
              phone,
              birthdate,
              picture,
              favoriteSports: values,
              favoriteTeams,
              favoritePlayers,
            };
            const result = onChange(modelFields);
            values = result?.favoriteSports ?? values;
          }
          setFavoriteSports(values);
          setCurrentFavoriteSportsValue("");
        }}
        currentFieldValue={currentFavoriteSportsValue}
        label={"Favorite sports"}
        items={favoriteSports}
        hasError={errors?.favoriteSports?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("favoriteSports", currentFavoriteSportsValue)
        }
        errorMessage={errors?.favoriteSports?.errorMessage}
        setFieldValue={setCurrentFavoriteSportsValue}
        inputFieldRef={favoriteSportsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Favorite sports"
          isRequired={false}
          isReadOnly={false}
          value={currentFavoriteSportsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.favoriteSports?.hasError) {
              runValidationTasks("favoriteSports", value);
            }
            setCurrentFavoriteSportsValue(value);
          }}
          onBlur={() =>
            runValidationTasks("favoriteSports", currentFavoriteSportsValue)
          }
          errorMessage={errors.favoriteSports?.errorMessage}
          hasError={errors.favoriteSports?.hasError}
          ref={favoriteSportsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "favoriteSports")}
        ></TextField>
      </ArrayField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              username,
              email,
              address,
              city,
              state,
              zipCode,
              phone,
              birthdate,
              picture,
              favoriteSports,
              favoriteTeams: values,
              favoritePlayers,
            };
            const result = onChange(modelFields);
            values = result?.favoriteTeams ?? values;
          }
          setFavoriteTeams(values);
          setCurrentFavoriteTeamsValue("");
        }}
        currentFieldValue={currentFavoriteTeamsValue}
        label={"Favorite teams"}
        items={favoriteTeams}
        hasError={errors?.favoriteTeams?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("favoriteTeams", currentFavoriteTeamsValue)
        }
        errorMessage={errors?.favoriteTeams?.errorMessage}
        setFieldValue={setCurrentFavoriteTeamsValue}
        inputFieldRef={favoriteTeamsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Favorite teams"
          isRequired={false}
          isReadOnly={false}
          value={currentFavoriteTeamsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.favoriteTeams?.hasError) {
              runValidationTasks("favoriteTeams", value);
            }
            setCurrentFavoriteTeamsValue(value);
          }}
          onBlur={() =>
            runValidationTasks("favoriteTeams", currentFavoriteTeamsValue)
          }
          errorMessage={errors.favoriteTeams?.errorMessage}
          hasError={errors.favoriteTeams?.hasError}
          ref={favoriteTeamsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "favoriteTeams")}
        ></TextField>
      </ArrayField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              username,
              email,
              address,
              city,
              state,
              zipCode,
              phone,
              birthdate,
              picture,
              favoriteSports,
              favoriteTeams,
              favoritePlayers: values,
            };
            const result = onChange(modelFields);
            values = result?.favoritePlayers ?? values;
          }
          setFavoritePlayers(values);
          setCurrentFavoritePlayersValue("");
        }}
        currentFieldValue={currentFavoritePlayersValue}
        label={"Favorite players"}
        items={favoritePlayers}
        hasError={errors?.favoritePlayers?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks(
            "favoritePlayers",
            currentFavoritePlayersValue
          )
        }
        errorMessage={errors?.favoritePlayers?.errorMessage}
        setFieldValue={setCurrentFavoritePlayersValue}
        inputFieldRef={favoritePlayersRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Favorite players"
          isRequired={false}
          isReadOnly={false}
          value={currentFavoritePlayersValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.favoritePlayers?.hasError) {
              runValidationTasks("favoritePlayers", value);
            }
            setCurrentFavoritePlayersValue(value);
          }}
          onBlur={() =>
            runValidationTasks("favoritePlayers", currentFavoritePlayersValue)
          }
          errorMessage={errors.favoritePlayers?.errorMessage}
          hasError={errors.favoritePlayers?.hasError}
          ref={favoritePlayersRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "favoritePlayers")}
        ></TextField>
      </ArrayField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
