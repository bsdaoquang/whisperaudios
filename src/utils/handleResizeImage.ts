import ImageResizer from '@bam.tech/react-native-image-resizer';

export const handleResizeImage = async (file: any) => {
  const newImage = await ImageResizer.createResizedImage(
    file.uri,
    500,
    500,
    'PNG',
    30,
    0,
  );

  return {
    uri: newImage.uri,
    name: `image-${new Date().getTime()}`,
    type: 'image/png',
    size: newImage.size ?? 0,
  };
};
