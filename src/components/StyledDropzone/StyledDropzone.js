import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import light from '../../themes/light';

const getColor = (props) => {
    if (props.isDragAccept) {
        return light.color.primaryShadow;
    }
    if (props.isDragReject) {
        return light.color.secondary;
    }
    if (props.isDragActive) {
        return light.color.primaryShadow;
    }
    return light.color.primary;
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 1px;
  border-radius: 2px;
  border-color: ${props => props.disabled ? '#AAAAAA' : getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  transition: border .24s ease-in-out;
  outline: none;
  margin-bottom: .4rem;
  color: ${props => props.disabled ? '#AAAAAA' : getColor(props)};
  cursor: pointer;
`;

export default function StyledDropzone({ accept, multiple, maxFiles, maxSize, text, setFileUploading, disabled, setValue }) {

    const [fileNames, setFileNames] = useState([]);
    const onDrop = useCallback(acceptedFiles => {
        acceptedFiles.map(file => {
            setValue('file', file, { shouldValidate: true })
            setFileNames(file.name);
            setFileUploading(file);
            console.debug('FILE A SER INSERIDO NO SET VALUE', file)
        })

    })

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept,
        multiple,
        maxFiles,
        maxSize,
        onDrop,
        disabled: disabled,
    });

    return (
        <div className="container">
            <Container {...getRootProps({ isDragActive, isDragAccept, isDragReject, disabled })}>
                <input {...getInputProps()} />
                <p>{text}</p>
            </Container>
            <p style={{ marginBottom: '.4rem' }}>{fileNames.length > 0 && `Arquivo selecionado: ${fileNames}`}</p>

        </div>
    );
}