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
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  transition: border .24s ease-in-out;
  outline: none;
  margin-bottom: .4rem;
  color: ${props => getColor(props)};
`;

export default function StyledDropzone({ accept, multiple, maxSize, text, setFileUploading }) {

    const [fileNames, setFileNames] = useState([]);
    const onDrop = useCallback(acceptedFiles => {
        acceptedFiles.map(file => {
            setFileNames(file.name);
            setFileUploading(file);
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
        maxSize,
        onDrop
    });

    return (
        <div className="container">
            <Container {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
                <input {...getInputProps()} />
                <p>{text}</p>
            </Container>
            <p style={{ marginBottom: '.4rem' }}>{fileNames.length > 0 && `Arquivo selecionado: ${fileNames}`}</p>

        </div>
    );
}