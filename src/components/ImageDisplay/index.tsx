import React, { useEffect, useLayoutEffect, useState } from 'react'
import Masonry from 'react-masonry-css'
import styled from 'styled-components'
import getImgList from '../../api/getImgList'
import { ImgList } from '../../api/interfaces'
import useSearchModel from '../../models/search'
import Image from './components/Image'

const breakpointColumnsObj = {
  default: 6,
  1800: 5,
  1500: 4,
  1100: 3,
  800: 2,
  600: 1,
}

const ImageDisplay = () => {
  const [imgList, setImgList] = useState<ImgList>([])
  const { searchValue } = useSearchModel()
  const [filteredList, setFilteredList] = useState(imgList)

  useLayoutEffect(() => {
    getImgList().then(setImgList)
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilteredList(
        imgList.filter(({ name }) =>
          searchValue !== '' ? name.includes(searchValue) : true,
        ),
      )
    }, 500)
    return () => {
      clearTimeout(handler)
    }
  }, [searchValue, imgList])

  return (
    <ImageContainer>
      <StyledMasonry
        breakpointCols={breakpointColumnsObj}
        className='grid'
        columnClassName='grid-column'
      >
        {filteredList.map(({ _id, name, src }) => (
          <div key={_id}>
            <Image alt={name} src={src} />
          </div>
        ))}
      </StyledMasonry>
    </ImageContainer>
  )
}

export default ImageDisplay

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
  max-width: 1600px;
`

const StyledMasonry = styled(Masonry)`
  display: flex;
  margin-left: -20px; /* gutter size offset */
  width: auto;
  .grid-column {
    padding-left: 20px; /* gutter size */
    background-clip: padding-box;
    > div {
      margin-bottom: 20px;
      > img {
        width: 100%;
        border-radius: var(--border-rounded);
        box-shadow: 0 0 8px var(--shadow-color);
        transition: box-shadow 0.2s ease-in-out;
        :hover {
          cursor: pointer;
          box-shadow: none;
        }
      }
    }
  }

  @media (max-width: 800px) {
    .grid {
      margin-left: -10px; /* gutter size offset */
      &-column {
        padding-left: 10px; /* gutter size offset */
        > div {
          margin-bottom: 10px; /* space between items */
        }
      }
    }
  }
`
